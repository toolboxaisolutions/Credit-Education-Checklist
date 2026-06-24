import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GHL_API_KEY;
const LOCATION_ID = process.env.GHL_LOCATION_ID;

// GHL V2 API base URL
const BASE_URL = 'https://services.leadconnectorhq.com';

// Load field ID mapping
const fieldIds: Record<string, string> = (() => {
  try {
    const data = require('../../fields-seeded.json');
    return data.created.reduce((acc: any, field: any) => {
      acc[field.name] = field.id;
      return acc;
    }, {});
  } catch {
    return {};
  }
})();

export const ghlService = {
  /**
   * Get contact by phone number
   * V2 API: GET /contacts/search?locationId=xxx&query=phone
   */
  async getContactByPhone(phone: string) {
    const response = await axios.get(`${BASE_URL}/contacts/search`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        Version: '2021-07-28',
      },
      params: {
        locationId: LOCATION_ID,
        query: phone,
      },
    });
    return response.data?.contacts?.[0] || null;
  },

  /**
   * Create new contact
   * V2 API: POST /contacts with locationId in body
   */
  async createContact(contact: {
    phone: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    customFields?: Record<string, string>;
  }) {
    const response = await axios.post(
      `${BASE_URL}/contacts`,
      {
        ...contact,
        locationId: LOCATION_ID,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          Version: '2021-07-28',
        },
      }
    );
    return response.data?.contact;
  },

  /**
   * Update contact custom fields
   * V2 API: PATCH /contacts/:contactId with { customFields: { fieldId: value } }
   * Note: V2 uses field IDs, not field names
   */
  async updateContact(contactId: string, customFields: Record<string, string>) {
    // Convert field names to IDs
    const fieldIdMap: Record<string, string> = {};
    for (const [fieldName, value] of Object.entries(customFields)) {
      const fieldId = fieldIds[fieldName];
      if (fieldId) {
        fieldIdMap[fieldId] = value;
      } else {
        console.warn(`⚠️  Field "${fieldName}" not found in field mapping`);
      }
    }

    const response = await axios.patch(
      `${BASE_URL}/contacts/${contactId}`,
      { customFields: fieldIdMap },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          Version: '2021-07-28',
        },
      }
    );
    return response.data?.contact;
  },

  /**
   * Create a workflow trigger (send contact to workflow)
   * V2 API: POST /workflows/:workflowId/contact/:contactId
   */
  async triggerWorkflow(contactId: string, workflowId: string) {
    const response = await axios.post(
      `${BASE_URL}/workflows/${workflowId}/contact/${contactId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          Version: '2021-07-28',
        },
      }
    );
    return response.data;
  },

  /**
   * Get all custom fields for the location
   */
  async getCustomFields() {
    const response = await axios.get(`${BASE_URL}/locations/${LOCATION_ID}/customFields`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        Version: '2021-07-28',
      },
    });
    return response.data?.customFields || [];
  },

  /**
   * Create a custom field
   * V2 API: POST /locations/:locationId/customFields
   * Note: We now know CHECKBOX needs options, use SINGLE_OPTIONS with Yes/No instead
   */
  async createCustomField(field: {
    name: string;
    dataType: string;
    options?: string[];
  }) {
    const response = await axios.post(
      `${BASE_URL}/locations/${LOCATION_ID}/customFields`,
      field,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          Version: '2021-07-28',
        },
      }
    );
    return response.data?.customField;
  },
};
