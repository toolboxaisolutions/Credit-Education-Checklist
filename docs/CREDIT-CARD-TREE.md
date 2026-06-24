# Credit Card Decision Tree

## Lifestyle Quiz Logic

### Question 1: Primary Goal
**"What do you want from a credit card?"**

Options:
1. **Build credit** (score < 640) → Secured cards
2. **Earn rewards** → Continue to Q2
3. **Finance a big purchase** → 0% APR cards
4. **Travel perks** → Travel cards

---

## Decision Branch: Build Credit (Score < 640)

### Sub-Question: Credit Score Range?
- **300-579 (Poor):**
  - Discover it® Secured Credit Card
  - OpenSky® Secured Visa® Credit Card
  - Capital One Platinum Secured

- **580-639 (Fair):**
  - Petal® 2 Visa® Credit Card
  - Tomo Credit Card
  - Capital One Quicksilver Secured

---

## Decision Branch: Earn Rewards (Score 640+)

### Question 2: Spending Category
**"Where does most of your spending happen?"**

Options:
1. **Gas & transportation**
2. **Groceries**
3. **Dining & entertainment**
4. **Travel (flights, hotels)**
5. **Everything (mixed spending)**

---

### Branch: Gas & Transportation

**Sub-Questions:**
- Do you want cashback or points?
  - Cashback: Citi Custom Cash℠ Card (5% on gas)
  - Points: None (gas cards are almost all cashback)

- Do you travel internationally?
  - Yes: Get a card with no foreign transaction fee
  - No: Any gas card works

**Recommendations:**
1. Citi Custom Cash℠ Card - 5% cashback on gas (自动)
2. Costco Anywhere Visa® - 4% on gas (requires Costco membership)
3. GetUp® Card - 3% on gas (flexible redemption)

---

### Branch: Groceries

**Sub-Questions:**
- Same grocery store every time?
  - Yes: Store-specific card (Target REDcard, Kroger, etc.)
  - No: General grocery card

- Credit score?
  - 640-699: Petal® 2, Capital One SavorOne Student
  - 700+: Amex Blue Cash Preferred, Citi Custom Cash

**Recommendations:**
1. Amex Blue Cash Preferred - 6% on groceries (up to $6k/year, then 1%)
2. Citi Custom Cash℠ - 5% on top spending category
3. Amex Blue Cash Everyday - 3% on groceries (no annual fee)

---

### Branch: Dining & Entertainment

**Sub-Questions:**
- Do you drink alcohol often? (Some cards have bar/liquor store bonuses)
- Do you go to concerts/events?
- International dining?

**Recommendations:**
1. Amex Gold Card - 4x on dining (including takeout)
2. Capital One Savor - 4x on dining & entertainment
3. Citi Custom Cash℠ - 5% if dining is top category
4. Chase Sapphire Reserve® - 3x on dining (premium travel card)

---

### Branch: Travel

**Sub-Questions:**
- Domestic or international?
  - Domestic: Any travel card
  - International: Must have NO foreign transaction fee

- Airlines preference?
  - Specific airline: Co-branded airline card
  - Flexible: General travel card

- Transfer partners matter?
  - Yes: Chase Sapphire, Amex Membership Rewards, Citi ThankYou
  - No: Capital One Venture, Barclaycard Arrival Plus

**Recommendations:**
1. Chase Sapphire Preferred® - 2x on travel, transferable points
2. Capital One Venture - 2x on everything, easy redemption
3. Amex Gold - 3x on flights (booked through Amex or directly)
4. Bank of America® Travel Rewards - 1.5x on everything, no foreign fee

---

### Branch: Everything (Mixed Spending)

**Sub-Questions:**
- Want simple cashback or category bonuses?
  - Simple: Flat-rate cashback
  - Bonuses: Rotating categories or top-spending category

- Credit score?
  - 640-699: Citi Double Cash, Petal® 2
  - 700-739: Capital One SavorOne, Amex Blue Cash Everyday
  - 740+: Amex Blue Cash Preferred, Chase Freedom Unlimited

**Recommendations:**
1. Citi Double Cash - 2% on everything (1% when you buy, 1% when you pay)
2. Capital One SavorOne - 3% on dining, entertainment, streaming; 1% everything else
3. Amex Blue Cash Everyday - 3% on groceries, gas, streaming; 2% at Walmart
4. Chase Freedom Unlimited - 5% on travel (Chase portal), 3% on dining, 1.5% everything else

---

## Decision Branch: Big Purchase Financing

### Question: Purchase Timeline?
- **Within 6 months:** 0% intro APR cards
- **Beyond 6 months:** Regular rewards cards (you have time to build)

### Sub-Questions:
- Purchase amount?
  - < $5,000: Any 0% APR card
  - $5,000+: Need higher credit limit (better credit required)

- How long to pay off?
  - 12 months: 12-month 0% intro
  - 15 months: 15-month 0% intro
  - 18+ months: 18-month 0% intro (rare, requires excellent credit)

**Recommendations:**
1. Citi Diamond Preferred® - 21 months 0% intro APR (longest available)
2. Chase Slate Edge℠ - 18 months 0% intro APR
3. Amex EveryDay® Credit Card - 15 months 0% intro APR
4. Discover it® Cash Back - 15 months 0% intro APR

---

## Credit Score Gate Logic

```javascript
function getRecommendedCards(userProfile) {
  const { creditScore, lifestyle, internationalTravel, purchaseTimeline } = userProfile;
  
  // Gate 1: Credit score determines card tier
  if (creditScore < 640) {
    return getSecuredCards(lifestyle);
  }
  
  // Gate 2: Purchase timeline determines APR focus
  if (purchaseTimeline && purchaseTimeline <= 6) {
    return getZeroAPRCards(purchaseTimeline);
  }
  
  // Gate 3: Lifestyle determines rewards category
  switch (lifestyle) {
    case 'gas':
      return getGasCards(internationalTravel);
    case 'groceries':
      return getGroceryCards(creditScore);
    case 'dining':
      return getDiningCards(creditScore);
    case 'travel':
      return getTravelCards(internationalTravel, creditScore);
    case 'everything':
      return getFlatRateCards(creditScore);
    default:
      return getMixedCards(creditScore);
  }
}
```

---

## Card Recommendation Output Format

For each recommendation, show:

### Card Name
**Issuer:** [Bank name]

**Annual Fee:** $X (or $0)

**APR:** X% variable

**Credit Required:** [Poor/Fair/Good/Excellent]

**Why This Card:**
[1-2 sentences explaining why it matches their profile]

**Key Rewards:**
- [Category 1]: [Rate]
- [Category 2]: [Rate]
- Everything else: [Rate]

**Best For:**
[Who this card is ideal for]

**[Apply Now →]** (affiliate link)

---

## Examples

### Example 1: Jake (Score 610, wants to build credit, spends on gas)

**Recommendation 1: Discover it® Secured**
- Annual Fee: $0
- APR: 22.99% variable
- Credit Required: No credit history (secured)
- Security Deposit: $200 minimum

**Why This Card:**
Perfect for building credit from scratch. Your credit utilization reports to all three bureaus, and after 8 months of responsible use, Discover may refund your deposit and convert to an unsecured card.

**Key Rewards:**
- Cashback Match: Dollar-for-dollar match of all cashback earned in first year
- Gas & restaurants: 2% cashback (on up to $1,000/quarter)
- Everything else: 1% cashback

**[Apply Now →]**

---

### Example 2: Rachel (Score 680, wants travel rewards, spends on dining)

**Recommendation 1: Amex Gold Card**
- Annual Fee: $250
- APR: Variable (carries balance not recommended)
- Credit Required: Good/Excellent (670+)

**Why This Card:**
Since you dine out 3+ times per week, this card earns 4x points at restaurants worldwide (including takeout). The $250 annual fee pays for itself if you spend $520+/year on dining.

**Key Rewards:**
- Dining: 4x Membership Rewards points
- Flights: 3x points (booked through Amex or directly with airline)
- Groceries: 3x points (up to $6,000/year, then 1x)
- Everything else: 1x points

**Additional Perks:**
- $120 dining credit (up to $10/month at participating restaurants)
- $120 Uber Cash (up to $10/month)
- No foreign transaction fees

**[Apply Now →]**

---

## Affiliate Strategy

### Implementation
1. Apply for affiliate programs:
   - CardRatings.com
   - CreditCards.com
   - NerdWallet
   - BankAmenity
   - Direct bank affiliate programs

2. Track applications:
   - Log every "Apply Now" click
   - Track conversions (approved cards)
   - Report affiliate revenue monthly

3. Typical commission:
   - $50-150 per approved card application
   - Higher for premium cards (Amex Gold: $150+)
   - Lower for secured cards ($30-50)

4. Disclosure requirements:
   - "We may earn a commission if you apply" (FTC requirement)
   - Place disclosure near "Apply Now" button
   - Don't let affiliate relationships influence recommendations

### Revenue Projection
- 1000 users in Year 1
- 40% complete the "Apply for Credit Card" task = 400 applications
- 60% approval rate = 240 approved cards
- Average commission: $80
- **Year 1 affiliate revenue: $19,200**

---

## Card Database Schema

```javascript
const creditCardSchema = {
  id: UUID,
  name: String,
  issuer: String,
  
  // Credit requirements
  minCreditScore: Number, // 300-850
  creditTier: Enum['poor', 'fair', 'good', 'excellent'],
  secured: Boolean,
  
  // Costs
  annualFee: Number,
  apr: Number, // Variable APR
  
  // Rewards
  rewardsType: Enum['cashback', 'points', 'miles'],
  rewardCategories: [{
    category: String, // 'gas', 'groceries', 'dining', 'travel', 'everything'
    rate: Number // Cashback % or points multiplier
  }],
  
  // Intro offers
  introApr: {
    duration: Number, // months
    appliesTo: Enum['purchases', 'balance_transfers', 'both']
  },
  signupBonus: {
    amount: Number, // dollars or points equivalent
    spendRequirement: Number, // minimum spend
    timeframe: Number // days to meet requirement
  },
  
  // Features
  foreignTransactionFee: Boolean,
  creditMonitoring: Boolean,
  travelInsurance: Boolean,
  
  // Affiliate
  affiliateUrl: String,
  affiliateNetwork: String,
  commission: Number,
  
  // Metadata
  lastUpdated: Date,
  isActive: Boolean
};
```
