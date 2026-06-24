import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

const API_KEY = process.env.GHL_API_KEY;
const LOCATION_ID = process.env.GHL_LOCATION_ID;

const BASE_URL = 'https://services.leadconnectorhq.com';

/*
 * GHL V2 API field rules learned from testing:
 * - NUMERICAL: just needs dataType (worked above)
 * - SINGLE_OPTIONS: needs `options` as array of strings
 * - CHECKBOX: is a multi-select, also needs `options` as array of strings
 *   → For Yes/No toggle, use SINGLE_OPTIONS with ['Yes', 'No']
 */

interface FieldDef {
  name: string;
  dataType: string;
  options?: string[];
}

const yesNo = ['Yes', 'No'];

const customFields: FieldDef[] = [
  // Progress tracking (SINGLE_OPTIONS with string values)
  { name: 'current_phase', dataType: 'SINGLE_OPTIONS', options: ['1', '2', '3', '4', '5'] },
  {
    name: 'current_task',
    dataType: 'SINGLE_OPTIONS',
    options: Array.from({ length: 16 }, (_, i) => String(i + 1)),
  },

  // Task completion flags — use SINGLE_OPTIONS Yes/No (not CHECKBOX, which is multi-select)
  { name: 'task_01_pull_reports', dataType: 'SINGLE_OPTIONS', options: yesNo },
  { name: 'task_02_understand_score', dataType: 'SINGLE_OPTIONS', options: yesNo },
  { name: 'task_03_set_up_budget', dataType: 'SINGLE_OPTIONS', options: yesNo },
  { name: 'task_04_safety_net', dataType: 'SINGLE_OPTIONS', options: yesNo },
  { name: 'task_05_dispute_errors', dataType: 'SINGLE_OPTIONS', options: yesNo },
  { name: 'task_06_negotiate_collections', dataType: 'SINGLE_OPTIONS', options: yesNo },
  { name: 'task_07_autopay', dataType: 'SINGLE_OPTIONS', options: yesNo },
  { name: 'task_08_secured_card', dataType: 'SINGLE_OPTIONS', options: yesNo },
  { name: 'task_09_authorized_user', dataType: 'SINGLE_OPTIONS', options: yesNo },
  { name: 'task_10_credit_builder', dataType: 'SINGLE_OPTIONS', options: yesNo },
  { name: 'task_11_credit_limit_increase', dataType: 'SINGLE_OPTIONS', options: yesNo },
  { name: 'task_12_better_cards', dataType: 'SINGLE_OPTIONS', options: yesNo },
  { name: 'task_13_optimize_utilization', dataType: 'SINGLE_OPTIONS', options: yesNo },
  { name: 'task_14_credit_monitoring', dataType: 'SINGLE_OPTIONS', options: yesNo },
  { name: 'task_15_annual_review', dataType: 'SINGLE_OPTIONS', options: yesNo },
  { name: 'task_16_score_goals', dataType: 'SINGLE_OPTIONS', options: yesNo },

  // Credit scores (already created, will skip as existing)
  { name: 'starting_credit_score', dataType: 'NUMERICAL' },
  { name: 'current_credit_score', dataType: 'NUMERICAL' },

  // Lifestyle preferences
  { name: 'primary_goal', dataType: 'SINGLE_OPTIONS', options: ['Build credit', 'Earn rewards', 'Big purchase financing'] },
  { name: 'spending_category', dataType: 'SINGLE_OPTIONS', options: ['Gas', 'Groceries', 'Dining/Entertainment', 'Travel', 'Everything'] },
  { name: 'international_travel', dataType: 'SINGLE_OPTIONS', options: yesNo },
  { name: 'preferred_card_rewards', dataType: 'SINGLE_OPTIONS', options: ['Points', 'Cashback', 'Miles'] },

  // Bonus fields
  { name: 'secured_card_choice', dataType: 'SINGLE_OPTIONS', options: ['Discover It Secured', 'OpenSky Secured', 'Capital One Platinum Secured'] },
  { name: 'credit_builder_service', dataType: 'SINGLE_OPTIONS', options: ['Self Financial', 'Credit Union', 'Kikoff', 'Atomic'] },
  { name: 'onboarding_complete', dataType: 'SINGLE_OPTIONS', options: yesNo },
];

async function tryCreateField(field: FieldDef, attempt: number = 1): Promise<{ id: string; created: boolean }> {
  const body: any = { name: field.name, dataType: field.dataType };
  if (field.options) {
    // Try plain string array first
    body.options = field.options;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/locations/${LOCATION_ID}/customFields`,
      body,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28',
          'Accept': 'application/json',
        },
      }
    );
    const data = response.data?.customField || response.data;
    return { id: data.id || 'unknown', created: true };
  } catch (error: any) {
    const { status, data } = error.response || {};
    const msg = data?.message || data?.error || '';

    // If plain string array fails, try as [{name}] objects
    if (status === 400 && typeof msg === 'string' && msg.includes('trim') && attempt === 1 && field.options) {
      // Retry with different options format
      const retryBody = {
        ...body,
        options: field.options.map(o => ({ name: o })),
      };
      try {
        const res = await axios.post(
          `${BASE_URL}/locations/${LOCATION_ID}/customFields`,
          retryBody,
          {
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
              'Content-Type': 'application/json',
              'Version': '2021-07-28',
              'Accept': 'application/json',
            },
          }
        );
        const d = res.data?.customField || res.data;
        return { id: d.id || 'unknown', created: true };
      } catch (retryErr: any) {
        return { id: '', created: false };
      }
    }

    // Already exists (400/409 with "already exists" message) — not an error
    if (status === 400 && typeof msg === 'string' && msg.toLowerCase().includes('already exists')) {
      return { id: 'existing', created: false };
    }
    if (status === 409) {
      return { id: 'existing', created: false };
    }

    return { id: '', created: false };
  }
}

async function seed() {
  let created = 0;
  let exists = 0;
  let failed = 0;
  const createdFields: Array<{ name: string; id: string }> = [];
  const failedFields: Array<{ name: string; reason: string }> = [];

  console.log(`\n🚀 Seeding ${customFields.length} custom fields → GHL location ${LOCATION_ID}\n`);

  for (const field of customFields) {
    const result = await tryCreateField(field);
    if (result.created) {
      console.log(`✅ ${field.name} (id: ${result.id})`);
      createdFields.push({ name: field.name, id: result.id });
      created++;
    } else if (result.id === 'existing') {
      console.log(`⊘ ${field.name} (already exists)`);
      exists++;
    } else {
      console.error(`❌ ${field.name}`);
      failed++;
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n📊 Summary`);
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⊘  Existing: ${exists}`);
  console.log(`   ❌ Failed:   ${failed}`);

  // Save results
  const output = {
    seededAt: new Date().toISOString(),
    locationId: LOCATION_ID,
    created: createdFields,
  };
  fs.writeFileSync('./fields-seeded.json', JSON.stringify(output, null, 2));
  console.log(`\n📝 Created fields saved to fields-seeded.json`);
}

seed().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
