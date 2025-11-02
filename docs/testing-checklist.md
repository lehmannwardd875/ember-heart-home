# Testing & QA Checklist - Hearth Platform

**Last Updated:** 2025-11-02  
**Status:** In Progress

---

## 🧪 Functional Testing

### Authentication & Onboarding
- [ ] **Sign up flow**
  - [ ] Email/password registration works
  - [ ] Email validation catches invalid formats
  - [ ] Password strength requirements enforced
  - [ ] Duplicate email registration prevented
  - [ ] Confirmation email sent (if enabled)
  - [ ] Redirect to /welcome after signup
  
- [ ] **Sign in flow**
  - [ ] Valid credentials allow login
  - [ ] Invalid credentials show error
  - [ ] "Forgot password" flow works
  - [ ] Session persists across page reloads
  - [ ] Auto-redirect to /matches if already logged in
  
- [ ] **Welcome page**
  - [ ] Form validation works (name, age, email)
  - [ ] Age must be 45-65
  - [ ] Data saves and progresses to /verify
  - [ ] "Skip for now" button works

### Verification Flow (Mock)
- [ ] **Selfie upload**
  - [ ] File picker opens
  - [ ] Preview shows uploaded image
  - [ ] Remove/replace image works
  - [ ] File size validation (max 5MB)
  - [ ] Accept only image formats

- [ ] **Video intro upload**
  - [ ] Video file picker opens
  - [ ] Preview shows video player
  - [ ] Remove/replace video works
  - [ ] File size validation (max 50MB)
  - [ ] Accept only video formats

- [ ] **LinkedIn verification**
  - [ ] Optional URL input accepts LinkedIn profiles
  - [ ] Invalid URLs show validation error
  - [ ] Can skip this step

- [ ] **Success flow**
  - [ ] Mock verification completes after 2s
  - [ ] Success animation displays
  - [ ] Redirects to /profile/create

### Profile Builder
- [ ] **Basic info section**
  - [ ] Profession field required
  - [ ] Education field optional
  - [ ] Progress indicator updates

- [ ] **Life focus section**
  - [ ] Single line input (max 150 chars)
  - [ ] Character counter displays
  - [ ] Validation enforces limit

- [ ] **Personal reflection section**
  - [ ] Textarea accepts 300-500 words
  - [ ] Word counter displays
  - [ ] Validation enforces word count

- [ ] **Taste cards section**
  - [ ] Can add 3-5 books
  - [ ] Can add 3-5 films
  - [ ] Can add 3-5 music entries
  - [ ] Can add 3-5 inspiration items
  - [ ] Can remove entries
  - [ ] Validation enforces min/max limits

- [ ] **Preview & publish**
  - [ ] Preview shows formatted profile
  - [ ] Save draft works (localStorage)
  - [ ] Publish saves to Supabase
  - [ ] Redirects to /profile/published

### Reflection Mode
- [ ] **Daily prompts**
  - [ ] New prompt appears daily
  - [ ] Prompt text displays correctly
  - [ ] Response textarea works
  
- [ ] **Response submission**
  - [ ] Can save private reflections
  - [ ] Can toggle "shared" status
  - [ ] Tone tags auto-generate (if AI enabled)
  - [ ] Saves to Supabase reflections table
  
- [ ] **History view**
  - [ ] Past reflections display
  - [ ] Can edit past reflections
  - [ ] Can delete reflections
  - [ ] Date sorting works

### Daily Matches
- [ ] **Match display**
  - [ ] 1-2 matches shown per day
  - [ ] Profile preview displays correctly
  - [ ] Shared reflections visible
  - [ ] Mutual values displayed
  
- [ ] **Interest actions**
  - [ ] "Interested" button works
  - [ ] "Pass" button works
  - [ ] Mutual interest creates match
  - [ ] Match notification appears
  - [ ] Redirects to /chat/:matchId on mutual match

### Private Chat
- [ ] **Chat interface**
  - [ ] Messages load from Supabase
  - [ ] Real-time updates work (new messages appear)
  - [ ] Can send text messages
  - [ ] Message bubbles styled correctly
  - [ ] Timestamps display
  
- [ ] **Features**
  - [ ] Verified badge shows in header
  - [ ] Character counter for messages
  - [ ] Mute/report/block menu accessible
  - [ ] Emoji picker works (if added)

### Settings Page
- [ ] **Profile management**
  - [ ] Can navigate to edit profile
  - [ ] Verification status badge displays
  - [ ] Photo upload works
  
- [ ] **Privacy settings**
  - [ ] Invisible mode toggle works
  - [ ] Reflection visibility settings save
  - [ ] Block list displays
  
- [ ] **Preferences**
  - [ ] Age range slider works
  - [ ] Geographic radius saves
  - [ ] Email notification toggles work
  
- [ ] **Account**
  - [ ] Change password works (if enabled)
  - [ ] Delete account shows confirmation
  - [ ] Logout works correctly

### Admin Panel
- [ ] **Access control**
  - [ ] Only admin users can access /admin
  - [ ] Non-admin users redirected
  
- [ ] **User management**
  - [ ] User list displays
  - [ ] Can verify/unverify users
  - [ ] Can view user profiles
  - [ ] Can suspend accounts
  
- [ ] **Moderation**
  - [ ] Flagged content displays
  - [ ] Can approve/reject profiles
  - [ ] Can remove inappropriate content

---

## 🎨 UI/UX Testing

### Visual Design
- [ ] **Colors & theming**
  - [ ] Copper (#B66E41) displays correctly
  - [ ] Sage (#78856D) displays correctly
  - [ ] Ivory (#FDF9F4) background works
  - [ ] Dark mode (if enabled) works
  
- [ ] **Typography**
  - [ ] Playfair Display loads for headings
  - [ ] Inter loads for body text
  - [ ] Font sizes appropriate (16-18pt minimum)
  - [ ] Line height provides readability (1.6+)
  
- [ ] **Animations**
  - [ ] Page transitions smooth (250-300ms)
  - [ ] Hover effects work on buttons
  - [ ] Fade-in animations not jarring
  - [ ] No motion sickness triggers

### Responsive Design
- [ ] **Mobile (320px - 767px)**
  - [ ] All pages display correctly
  - [ ] Navigation menu works
  - [ ] Forms usable on small screens
  - [ ] Touch targets min 44x44px
  - [ ] No horizontal scroll
  
- [ ] **Tablet (768px - 1023px)**
  - [ ] Layout adapts appropriately
  - [ ] Images scale correctly
  - [ ] Multi-column layouts work
  
- [ ] **Desktop (1024px+)**
  - [ ] Full layout displays
  - [ ] Max-width containers prevent over-stretch
  - [ ] Hover states work

---

## ♿ Accessibility Testing

### Keyboard Navigation
- [ ] Can tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Skip navigation link works
- [ ] Modal dialogs trap focus
- [ ] Escape key closes modals
- [ ] Enter/Space activate buttons

### Screen Reader Support
- [ ] All images have alt text
- [ ] Form labels associated with inputs
- [ ] ARIA labels on icon buttons
- [ ] Heading hierarchy correct (H1 → H2 → H3)
- [ ] Live regions for dynamic content
- [ ] Error messages announced

### Visual Accessibility
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 UI)
- [ ] No reliance on color alone for information
- [ ] Text resizable to 200% without breaking
- [ ] Focus indicators have 3:1 contrast ratio

---

## ⚡ Performance Testing

### Page Load Performance
- [ ] **Lighthouse Audit (Target: 90+)**
  - [ ] Performance score: ___/100
  - [ ] Accessibility score: ___/100
  - [ ] Best Practices score: ___/100
  - [ ] SEO score: ___/100
  
- [ ] **Core Web Vitals**
  - [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] FID (First Input Delay) < 100ms
  - [ ] CLS (Cumulative Layout Shift) < 0.1

### Asset Optimization
- [ ] Images optimized (WebP format preferred)
- [ ] Images lazy-loaded below fold
- [ ] Fonts preloaded
- [ ] CSS/JS minified
- [ ] Bundle size reasonable (< 500KB initial)

### Database Performance
- [ ] Queries return results < 200ms
- [ ] Indexes added for frequent queries
- [ ] RLS policies don't cause slowdowns
- [ ] Real-time subscriptions efficient

---

## 🔒 Security Testing

### Authentication Security
- [ ] Passwords hashed (Supabase default)
- [ ] No sensitive data in localStorage
- [ ] Session tokens secure (httpOnly cookies)
- [ ] CSRF protection enabled

### Row Level Security (RLS)
- [ ] Users can only see their own profiles
- [ ] Users can only edit their own data
- [ ] Verified users can't bypass verification
- [ ] Admin-only routes protected

### Input Validation
- [ ] SQL injection prevented
- [ ] XSS attacks blocked
- [ ] File uploads sanitized
- [ ] URL validation prevents open redirects

---

## 📧 Integration Testing

### Email Notifications
- [ ] Welcome email sends after signup
- [ ] New match email triggers correctly
- [ ] New message email triggers
- [ ] Unsubscribe link works
- [ ] Email templates render correctly

### Storage Integration
- [ ] Profile photos upload to Supabase Storage
- [ ] Video intros upload successfully
- [ ] Public URLs accessible
- [ ] File deletion works

### Payments (if enabled)
- [ ] Stripe checkout opens
- [ ] Payment processing works
- [ ] Webhook handles success/failure
- [ ] User updated after purchase

---

## 🌐 Cross-Browser Testing

- [ ] **Chrome** (latest version)
- [ ] **Firefox** (latest version)
- [ ] **Safari** (latest version)
- [ ] **Edge** (latest version)
- [ ] **Mobile Safari** (iOS)
- [ ] **Chrome Mobile** (Android)

---

## 📱 Device Testing

- [ ] iPhone 12/13/14 (iOS 16+)
- [ ] Samsung Galaxy S21/S22
- [ ] iPad (latest)
- [ ] MacBook (Safari & Chrome)
- [ ] Windows laptop (Chrome & Edge)

---

## 🐛 Bug Tracking

| Bug ID | Description | Severity | Status | Assigned To | Fixed In |
|--------|-------------|----------|--------|-------------|----------|
| BUG-001 | Example bug | High | Open | - | - |

---

## ✅ Test Sign-Off

- [ ] **Frontend Lead:** _______________  Date: _______
- [ ] **Backend Lead:** _______________  Date: _______
- [ ] **QA Lead:** _______________  Date: _______
- [ ] **Product Owner:** _______________  Date: _______

---

## 📝 Notes

### Known Issues
- List any known issues that are acceptable for launch

### Future Improvements
- List nice-to-have improvements for post-launch

### Testing Environment
- **Preview URL:** https://[project-id].lovableproject.com
- **Production URL:** TBD
- **Test Accounts:** 
  - Admin: admin@test.com
  - User 1: user1@test.com
  - User 2: user2@test.com
