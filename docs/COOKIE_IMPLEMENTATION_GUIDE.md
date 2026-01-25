# Cookie Implementation Guide - GDPR Compliance

## 📚 What Are Cookies?

**Cookies** are small text files that websites store on your device (computer, phone, tablet) when you visit them. Think of them as tiny memory notes that help websites remember things about you.

### How Cookies Work:
1. **When you visit a website** → The website sends a cookie to your browser
2. **Your browser stores it** → Saved on your device (usually in a folder)
3. **Next time you visit** → Your browser sends the cookie back to the website
4. **Website remembers you** → Uses the information to personalize your experience

### Example:
- You add items to a shopping cart → Cookie remembers what's in your cart
- You log in → Cookie remembers you're logged in
- You visit again → Cookie helps the site recognize you

---

## 🎯 Why Do We Use Cookies?

Cookies serve different purposes, categorized into 4 main types:

### 1. **Essential Cookies** (Always Required)
**Purpose:** Make the website work properly

**What they do:**
- Keep you logged in (authentication)
- Remember items in your shopping cart
- Keep your session secure
- Load balance traffic across servers
- Prevent fraud and security attacks

**Why we need them:** Without these, the website wouldn't function. You can't disable them.

**Example:** When you add a product to your cart, an essential cookie remembers it so it doesn't disappear when you navigate to another page.

---

### 2. **Analytics Cookies** (Optional)
**Purpose:** Help us understand how visitors use our website

**What they do:**
- Track which pages are most popular
- See how long people stay on pages
- Identify where visitors come from (Google, social media, etc.)
- Find errors and bugs
- Measure website performance

**Why we need them:** They help us improve the website by understanding user behavior. We can see what works and what doesn't.

**Example:** If we see that 80% of users leave on the checkout page, we know there's a problem we need to fix.

**Third-party:** Google Analytics uses these cookies to provide us with website statistics.

---

### 3. **Functional Cookies** (Optional)
**Purpose:** Remember your preferences and personalize your experience

**What they do:**
- Remember your language preference (English, Spanish, etc.)
- Remember your theme preference (dark mode, light mode)
- Remember your login information (if you choose "Remember me")
- Save your preferences and settings

**Why we need them:** They make your experience smoother and more personalized. You don't have to set your preferences every time you visit.

**Example:** If you prefer dark mode, a functional cookie remembers this so the site loads in dark mode next time.

---

### 4. **Marketing Cookies** (Optional)
**Purpose:** Show you relevant advertisements and track marketing campaigns

**What they do:**
- Show you ads for products you might like
- Track if you clicked on an ad
- Limit how many times you see the same ad
- Measure the effectiveness of marketing campaigns
- Enable social media sharing features

**Why we need them:** They help us show you products you're interested in and measure if our advertising works.

**Example:** If you looked at running shoes, marketing cookies might show you ads for running shoes on other websites (retargeting).

**Third-party:** Facebook Pixel, Google Ads, and other advertising platforms use these.

---

## ⚖️ Why Do We Need Cookie Permission? (GDPR Explained)

### What is GDPR?
**GDPR** stands for **General Data Protection Regulation** - a European Union law that protects people's privacy and personal data.

### Key GDPR Requirements:

#### 1. **Informed Consent**
- Users must **know** what cookies are being used
- Users must **understand** what each cookie does
- Users must **actively agree** (not just assume consent)

#### 2. **Granular Control**
- Users can **choose** which types of cookies to allow
- Users can **accept all** or **reject all**
- Users can **customize** their preferences

#### 3. **Easy to Withdraw**
- Users can **change their mind** anytime
- Cookie settings must be **easily accessible**
- Users can **opt-out** at any time

#### 4. **Transparency**
- Clear explanation of **what cookies do**
- Clear explanation of **why we use them**
- Link to **detailed cookie policy**

### Why This Matters:

**Before GDPR:**
- Websites could set cookies without asking
- Users had no control
- Privacy was not protected
- Personal data could be collected without consent

**After GDPR:**
- Websites **must ask** before setting non-essential cookies
- Users have **full control**
- Privacy is **protected by law**
- Companies can be **fined** for non-compliance (up to €20 million or 4% of annual revenue!)

---

## 🛡️ Our Implementation (GDPR-Compliant)

### What We've Built:

1. **Cookie Consent Banner**
   - Shows when you first visit (if no consent given)
   - Clear explanation of what cookies are used
   - Options: Accept All, Reject All, or Customize

2. **Cookie Settings Modal**
   - Detailed explanation of each cookie category
   - Toggle switches for each category (except Essential)
   - Easy to access from footer

3. **Cookie Categories**
   - **Essential:** Always enabled (required for site to work)
   - **Analytics:** Optional (Google Analytics)
   - **Functional:** Optional (preferences, theme)
   - **Marketing:** Optional (advertising, retargeting)

4. **Persistent Storage**
   - Your preferences are saved in localStorage
   - Banner won't show again after you've made a choice
   - You can change preferences anytime

5. **Compliance Features**
   - ✅ Clear information about each cookie type
   - ✅ Granular control (accept/reject by category)
   - ✅ Easy access to settings (footer link)
   - ✅ Link to detailed cookie policy
   - ✅ No cookies set until consent is given (except essential)

---

## 🔧 Technical Implementation

### How It Works:

1. **First Visit:**
   - User sees cookie banner
   - No non-essential cookies are set
   - Only essential cookies (session, cart) work

2. **User Makes Choice:**
   - Accepts/Rejects/Customizes cookies
   - Preferences saved to localStorage
   - Appropriate cookies enabled/disabled

3. **Subsequent Visits:**
   - Preferences loaded from localStorage
   - Only consented cookies are used
   - Banner doesn't show again

4. **User Changes Mind:**
   - Clicks "Cookie Settings" in footer
   - Can modify preferences anytime
   - Changes apply immediately

### Cookie Storage:
- **Essential:** Always stored (session cookies, cart cookies)
- **Analytics:** Only if user consents
- **Functional:** Only if user consents
- **Marketing:** Only if user consents

---

## 📋 Best Practices We Follow

1. **Essential cookies** are always enabled (required for functionality)
2. **Non-essential cookies** are only set after explicit consent
3. **Clear communication** about what each cookie does
4. **Easy access** to cookie settings (footer link)
5. **No dark patterns** (no pre-checked boxes, clear options)
6. **Respect user choice** (if they reject, we don't set those cookies)
7. **Regular updates** to cookie policy as needed

---

## 🎓 Summary

**Cookies are:**
- Small text files that help websites remember things
- Used for functionality, analytics, preferences, and marketing
- Regulated by GDPR in Europe/UK

**We need permission because:**
- GDPR requires informed consent
- Users have the right to control their data
- It's the law (and ethical!)

**Our implementation:**
- ✅ GDPR-compliant
- ✅ User-friendly
- ✅ Transparent
- ✅ Respects user choice

---

## 📞 Questions?

If you have questions about our cookie usage, check our [Cookie Policy](/cookie-policy) or contact us at support@1strep.com.
