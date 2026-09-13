# Portfolio Mobile Optimization

## Objective

Make the existing portfolio website fully responsive, polished, and usable on mobile phones without breaking the existing desktop version.

The existing design, branding, content, animations, functionality, and overall visual identity must be preserved.

Do NOT unnecessarily rewrite or rebuild the project.

First inspect the entire existing project and understand how it currently works before making changes.

---

## Task 1 — Audit the Existing Project

Inspect the entire portfolio codebase.

Identify:

- Current responsive behavior
- Fixed widths causing overflow
- Horizontal scrolling
- Elements going outside the viewport
- Navigation problems
- Hero section problems
- Project/card layout problems
- Text overflow or clipping
- Images/media overflowing
- Buttons that are difficult to tap
- Excessive padding or margins
- Broken flex/grid layouts
- Desktop-only assumptions
- Elements that overlap on smaller screens
- Any console/runtime errors related to the UI

Check the existing HTML/React components, CSS, JavaScript/TypeScript, assets, and configuration before modifying anything.

---

## Task 2 — Mobile Navigation

Make the existing navigation work properly on mobile devices.

Requirements:

- No horizontal overflow
- Navigation must fit within the viewport
- Links must be easy to tap
- Buttons must be usable on touch screens
- If a mobile menu already exists, fix it rather than replacing it unnecessarily
- If a mobile menu is required, implement it consistently with the existing design
- Preserve all existing navigation functionality
- Desktop navigation must continue working

---

## Task 3 — Responsive Layout

Make every major section responsive.

Inspect and optimize:

- Hero
- About
- Skills
- Projects
- Experience
- Education
- Achievements
- Contact
- Footer
- Any additional sections discovered in the project

Requirements:

- Content must fit the viewport
- Sections must stack appropriately on small screens
- No horizontal page scrolling
- No content should be cut off
- Cards must fit the screen
- Images must scale correctly
- Buttons must remain usable
- Spacing must be intentional
- Existing desktop layout should be preserved wherever possible

---

## Task 4 — Typography

Review all typography at mobile breakpoints.

Ensure:

- Headings do not overflow
- Text does not get clipped
- Text wraps naturally
- Body text remains readable
- Font sizes scale appropriately
- Line heights remain comfortable
- Important headings remain visually prominent
- Long words/URLs do not break the layout

Do not blindly make everything smaller.

---

## Task 5 — Images, Icons and Media

Inspect all images, icons, videos, backgrounds and other media.

Ensure:

- Nothing overflows the viewport
- Images maintain appropriate aspect ratios
- Images do not become distorted
- Images scale correctly on mobile
- Decorative elements do not create horizontal scrolling
- Background images remain visually appropriate
- Project images/cards remain usable on small screens

Do not remove assets unless absolutely necessary.

---

## Task 6 — Touch Usability

Review all interactive elements.

Ensure:

- Buttons are easy to tap
- Navigation controls are easy to tap
- Links are not unnecessarily packed together
- Forms are usable on phones
- Inputs fit within the viewport
- Social links remain accessible
- Interactive elements do not depend on desktop-sized space

Preserve existing interactions.

---

## Task 7 — Responsive Breakpoints

Test and optimize the portfolio at approximately:

- 320px width
- 375px width
- 390px width
- 430px width

Also verify desktop at approximately:

- 1280px width
- 1440px width

Do not optimize only for one phone size.

---

## Task 8 — Desktop Regression Check

After making mobile changes, verify that the desktop version still works.

Check:

- Navigation
- Hero
- About
- Skills
- Projects
- Experience
- Contact
- Footer
- Animations
- Buttons
- Links
- Forms
- Existing interactions

Do not sacrifice desktop functionality to fix mobile issues.

---

## Task 9 — Testing and Verification

The work is NOT complete merely because code was changed.

Run the project's available:

- Tests
- Typecheck
- Lint
- Production build

Use the appropriate commands based on the existing project configuration.

If a check fails:

1. Investigate the failure.
2. Determine whether it was caused by the changes.
3. Fix the problem.
4. Run the check again.

Do not simply report failures.

---

## Task 10 — Final Mobile Verification

Before declaring the task complete, perform a final verification of the actual implementation.

Look specifically for:

- Horizontal scrolling
- Content overflowing the viewport
- Text clipping
- Overlapping elements
- Broken navigation
- Broken buttons
- Broken links
- Images overflowing
- Incorrect spacing
- Unusable mobile controls
- Console errors
- Layout shifts
- Desktop regressions

If any issue is discovered:

FIX IT.

Then TEST AGAIN.

---

# Definition of Done

Do NOT declare this project complete until all applicable requirements below are satisfied:

- [ ] Portfolio works correctly on mobile
- [ ] No horizontal scrolling at tested mobile widths
- [ ] All major sections are responsive
- [ ] Mobile navigation works
- [ ] Buttons and links are usable by touch
- [ ] Images and media do not overflow
- [ ] Typography is readable
- [ ] No important text is clipped
- [ ] No major elements overlap
- [ ] Desktop layout still works
- [ ] Existing functionality is preserved
- [ ] Tests pass, if configured
- [ ] Typecheck passes, if configured
- [ ] Lint passes, if configured
- [ ] Production build passes, if configured
- [ ] Console/runtime errors introduced by the changes are fixed
- [ ] Problems discovered during verification are fixed
- [ ] Final verification is performed after all fixes

The task is complete only when the implementation has been tested and the acceptance criteria are satisfied.

Do not stop merely because the code compiles.

Do not claim success without verification.
