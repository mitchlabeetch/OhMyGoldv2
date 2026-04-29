# Phase 7: Advanced Features & Innovation

> **Phase ID:** P7
> **Duration:** 4-5 weeks
> **Prerequisites:** Phase 4 complete (all core APIs available), Phases 5-6 in progress or complete
> **Goal:** Implement AI-powered and innovative features that differentiate OhMyGold from competitors

---

## Phase Overview

Phase 7 builds the features that make OhMyGold more than a Resamania clone. These are the competitive differentiators: AI churn prediction, smart recommendations, community features, gamification, wearable integrations, video content, nutrition tracking, social features, advanced analytics, and IoT integration.

The research synthesis identified AI as "table stakes" for 2026, community features as retention drivers, and wearable integrations as member expectations. These features transform OhMyGold from a management tool into a member engagement platform.

**Key principle:** Build on top of the core system. These features consume data from Phase 4 modules and expose it through new interfaces.

---

## 7.1 AI-Powered Churn Prediction

### Description and Scope
Implement an AI model that predicts which members are at risk of cancelling based on attendance patterns, engagement metrics, subscription history, and behavioral signals. Display risk scores in dashboards, trigger automated retention campaigns, and provide actionable recommendations to staff.

### Why This Matters
Member churn is the #1 revenue risk for gyms. The average gym loses 30-50% of members annually. Predicting churn before it happens allows proactive intervention — a personalized offer, a coach check-in, a class recommendation. Research shows AI churn prediction can reduce churn by 20-30%.

### Technical Approach
Start with rule-based heuristics (attendance decline, booking drop-off, failed payments) then enhance with ML. Feature engineering: attendance frequency (7/14/30 day), booking patterns, engagement (app opens, push interactions), payment history, support tickets. Model: simple classifier (logistic regression or random forest) trained on historical data. Risk score: 0-100. Threshold: > 70 = high risk, trigger intervention. Deploy via Edge Function or Python microservice.

### Files/Directories to Create/Modify
```
supabase/functions/ai-churn/
├── index.ts                 # Churn prediction API
├── feature-engineering.ts   # Extract features from member data
└── model.ts                 # Prediction logic
apps/web/src/pages/manager/
└── churn-prediction.tsx     # Churn dashboard
```

### Dependencies on Other Items
- Phase 4 (member data, attendance, billing history)

### Success Criteria
```
[ ] Churn risk score calculated for every active member
[ ] Features: attendance frequency, booking patterns, engagement, payments
[ ] Risk categories: Low (< 40), Medium (40-70), High (> 70)
[ ] High-risk members flagged on manager dashboard
[ ] Automated retention campaign triggered for high-risk members
[ ] Actionable recommendations: "Member hasn't attended in 14 days — send personal offer"
[ ] Model accuracy: > 85% precision, > 80% recall on test data (industry standard for churn prediction)
[ ] Daily recalculation of risk scores
[ ] Historical accuracy tracking (predicted vs actual churn)
[ ] Staff can mark intervention taken and result
```

### Estimated Effort
5-6 days

### LLM Agent Launch Prompt

```
Implement AI-powered churn prediction for OhMyGold.

CONTEXT: Predict member churn risk using behavioral data. Enable proactive retention interventions.

TASK:
1. Feature engineering:
   - Last 7/14/30 day attendance count
   - Booking frequency trend (increasing/decreasing)
   - App engagement (logins, push opens)
   - Payment history (failed payments, late payments)
   - Class attendance vs. gym-only visits
   - Subscription tenure
   - Member age (time since enrollment)
   - Feature store: pre-calculated daily

2. Prediction model:
   - Phase 1: Rule-based scoring (heuristic)
     * Each feature contributes points
     * Sum = risk score (0-100)
   - Phase 2: ML classifier (random forest)
     * Train on historical churn data
     * Feature importance analysis
     * A/B test vs rule-based
   - Deploy as Edge Function

3. Risk display:
   - Member list: risk indicator (green/amber/red dot)
   - Dashboard: at-risk member count
   - Member profile: risk score + contributing factors
   - Filter: show only high-risk members

4. Automated interventions:
   - High risk → trigger email: "We miss you! Free personal training session"
   - Medium risk → push: "Your favorite class is tomorrow — book now?"
   - Track intervention effectiveness

5. Accuracy tracking:
   - Weekly: predicted vs actual churn
   - Model performance metrics: precision, recall, F1
   - Retraining schedule: monthly

REQUIREMENTS:
- Model accuracy > 70% precision
- Daily score recalculation
- Edge Function deployment
- Intervention tracking
- Privacy: scores visible only to staff

REFERENCE:
- Research §5.5 (AI): /mnt/agents/output/ohmygold/team2_resamania_analysis/research/05_technical_best_practices.md
- New Features §7: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/03_new_features_proposals.md

FILES TO CREATE:
- supabase/functions/ai-churn/index.ts
- supabase/functions/ai-churn/feature-engineering.ts
- supabase/functions/ai-churn/model.ts
- apps/web/src/pages/manager/churn-prediction.tsx

VERIFICATION STEPS:
1. Risk scores calculated for all members
2. High-risk members correctly identified
3. Automated intervention triggered
4. Accuracy tracking dashboard
5. Intervention effectiveness measured

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Model type: rule-based/ML
- Accuracy: ___% precision
- Features used: ___
- Intervention triggers: ___
```

---

## 7.2 Smart Recommendation Engine

### Description and Scope
Build a recommendation engine that suggests classes, workout routines, and content based on member preferences, attendance history, goals, and similar member behavior. Display recommendations in the app home screen and booking flow.

### Why This Matters
Personalization drives engagement. When members see classes they actually want to attend, booking rates increase. Recommendation engines used by Netflix, Spotify, and fitness apps increase engagement by 30-50%. For Gold's Gym, this means higher class attendance and member satisfaction.

### Technical Approach
Collaborative filtering: members with similar attendance patterns get similar recommendations. Content-based: recommend classes similar to ones the member has attended. Hybrid: combine both approaches. Feature: class type, time preference, instructor preference, intensity level. Deploy via Edge Function. Cache recommendations for performance.

### Files/Directories to Create/Modify
```
supabase/functions/recommendations/
├── index.ts                 # Recommendation API
├── collaborative-filter.ts  # Similar member-based
├── content-based.ts         # Similar class-based
└── hybrid.ts                # Combined approach
apps/mobile/src/components/
└── RecommendedClasses.tsx
```

### Dependencies on Other Items
- Phase 4 (class data, booking history, member profiles)
- 7.1 (churn data can inform recommendations)

### Success Criteria
```
[ ] Class recommendations on home screen
[ ] "Because you attended Yoga" type explanations
[ ] Time-aware: recommend classes at preferred times
[ ] Goal-aware: recommend classes aligned with member goals
[ ] Click-through rate: > 20%
[ ] Booking conversion from recommendations: > 10%
[ ] Similar member recommendations (collaborative filtering)
[ ] New member cold-start: popular classes fallback
[ ] A/B testing framework for recommendation variants
[ ] Explanations: why this class was recommended
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Implement the smart recommendation engine for OhMyGold.

CONTEXT: Personalize class and content recommendations to increase engagement and bookings.

TASK:
1. Recommendation strategies:
   - Content-based: similar to attended classes (same type, instructor, time)
   - Collaborative: members like you also attend...
   - Popular: trending classes (new member fallback)
   - Goal-based: aligned with member fitness goals
   - Time-based: classes at member's preferred times

2. Feature extraction:
   - Member: preferred types, instructors, times, intensity
   - Class: type, instructor, time, intensity, popularity
   - Similarity: cosine similarity between member and class vectors

3. API:
   - Input: member_id, context (home, booking, class_detail)
   - Output: ranked recommendations with scores and explanations
   - Cache: recommendations cached for 1 hour
   - Fallback: popular classes if insufficient data

4. Display:
   - Home screen: "Recommended for You" horizontal scroll
   - Booking: "You might also like" after booking
   - Class detail: "Members also attended"
   - Explanations: "Because you enjoy morning Yoga"

5. Metrics:
   - Impressions, clicks, bookings from recommendations
   - A/B test different strategies
   - Weekly performance report

REQUIREMENTS:
- Response time: < 200ms
- Click-through rate target: > 20%
- Explainable recommendations
- Privacy: no cross-member data exposure

FILES TO CREATE:
- supabase/functions/recommendations/index.ts
- supabase/functions/recommendations/collaborative-filter.ts
- supabase/functions/recommendations/content-based.ts
- supabase/functions/recommendations/hybrid.ts
- apps/mobile/src/components/RecommendedClasses.tsx

VERIFICATION STEPS:
1. Recommendations generated for test member
2. Displayed on home screen
3. Click-through tracking
4. A/B test variant performance
5. Response time < 200ms

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Strategies: content/collaborative/popular/goal/time
- Click-through rate: ___%
- Booking conversion: ___%
- Response time: ___ ms
```

---

## 7.3 Community Features (Challenges, Leaderboards)

### Description and Scope
Build community engagement features: fitness challenges (individual and team), leaderboards, achievement sharing, and member interaction. Challenges have goals (attendance, workouts), timeframes, and rewards. Leaderboards rank members by various metrics.

### Why This Matters
Community drives retention. Members who feel connected to a community stay longer. Challenges create fun competition and social accountability. Research shows community features increase retention by 25% and daily active usage by 40%. This transforms OhMyGold from a utility into a social platform.

### Technical Approach
Challenges table with goals, timeframes, participants, and progress. Leaderboard views: overall, by location, by challenge. Real-time updates via Supabase Realtime. Social sharing: generate shareable images for achievements. Team challenges: members form teams, collective progress tracked.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000059_challenges.sql
├── 00000000000060_leaderboards.sql
└── 00000000000061_challenge_participants.sql
supabase/functions/challenges/
apps/mobile/src/app/(app)/
└── community/
    ├── challenges.tsx
    ├── leaderboard.tsx
    └── teams.tsx
```

### Dependencies on Other Items
- Phase 4 (member data, attendance, check-in APIs)

### Success Criteria
```
[ ] Create challenges: name, goal, timeframe, reward
[ ] Challenge types: attendance, workouts, streak, weight loss
[ ] Individual challenges: personal goal tracking
[ ] Team challenges: form teams, collective progress
[ ] Leaderboards: rank by attendance, workouts, streaks
[ ] Leaderboard filters: global, by location, by challenge
[ ] Real-time leaderboard updates
[ ] Achievement sharing: generate shareable image
[ ] Challenge notifications: started, progress, ended
[ ] Reward distribution: badges, points, discounts
[ ] Challenge history: past challenges and results
[ ] Community feed: see what others are achieving
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Implement community features for OhMyGold.

CONTEXT: Community drives retention. Challenges and leaderboards create engagement and social connection.

TASK:
1. Challenges:
   - Table: id, name, description, type, goal, start_date, end_date, reward
   - Types: attendance (X visits), workouts (X classes), streak (consecutive days), weight_loss, custom
   - Status: upcoming, active, completed
   - Reward: badge, points, discount code

2. Challenge participation:
   - Join challenge (opt-in)
   - Track progress: current / goal
   - Progress bar visualization
   - Reminder notifications

3. Team challenges:
   - Create or join team
   - Team progress: combined member progress
   - Team leaderboard
   - Team chat (basic)

4. Leaderboards:
   - Metrics: total check-ins, classes attended, current streak
   - Filters: this week, this month, all time
   - Scope: global, location-specific
   - Top 10 display with member photo and name
   - Current user's rank highlighted

5. Sharing:
   - Generate achievement image (completed challenge, rank)
   - Share to social media
   - In-app activity feed

REQUIREMENTS:
- Real-time leaderboard updates
- Opt-in for challenges (GDPR)
- Achievement images: branded, shareable
- Notifications: challenge events
- French and English

FILES TO CREATE:
- supabase/migrations/00000000000059_challenges.sql
- supabase/migrations/00000000000060_leaderboards.sql
- supabase/functions/challenges/index.ts
- apps/mobile/src/app/(app)/community/challenges.tsx
- apps/mobile/src/app/(app)/community/leaderboard.tsx
- apps/mobile/src/app/(app)/community/teams.tsx

VERIFICATION STEPS:
1. Create and join challenge
2. Progress tracked correctly
3. Leaderboard ranks correctly
4. Achievement sharing generates image
5. Team challenge: collective progress
6. Real-time updates verified

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Challenge types: ___
- Leaderboard metrics: ___
- Sharing: Yes/No
- Real-time updates: Yes/No
```

---

## 7.4 Gamification System (Badges, Streaks, Achievements)

### Description and Scope
Build a comprehensive gamification system: achievement badges for milestones (first workout, 10 classes, 30-day streak), streak tracking, points/XP system, levels, and reward redemption. Displayed on profile, shared in community feed, and used for rewards.

### Why This Matters
Gamification creates habit loops. When members earn badges and maintain streaks, they form gym habits. Studies show gamification increases daily active users by 40% and retention by 30%. The dopamine hit from earning a badge keeps members coming back.

### Technical Approach
Badges table with criteria (e.g., "attend 10 yoga classes"), icon, rarity. Streak tracking: consecutive days with check-in. XP system: points for actions (check-in, book class, complete challenge). Levels: XP thresholds. Reward shop: redeem points for discounts, merchandise, free sessions. Achievement feed: public display of earned badges.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000062_badges.sql
├── 00000000000063_member_achievements.sql
├── 00000000000064_streaks.sql
└── 00000000000065_xp_points.sql
supabase/functions/gamification/
apps/mobile/src/app/(app)/
└── achievements/
    ├── index.tsx
    └── badge-collection.tsx
```

### Dependencies on Other Items
- Phase 4 (attendance, booking, check-in data)
- 7.3 (community features integration)

### Success Criteria
```
[ ] Badge system: 20+ badges across categories
[ ] Badge categories: attendance, classes, streaks, social, challenges
[ ] Streak tracking: consecutive days, current and longest
[ ] Streak freeze: one free freeze per month (prevent loss)
[ ] XP system: points for every action
[ ] Level system: XP thresholds for levels
[ ] Reward shop: redeem points for discounts, merchandise
[ ] Achievement notifications: push on badge earn
[ ] Badge display: profile, shareable image
[ ] Leaderboard integration: rank by XP
[ ] Retroactive badges: award for past achievements
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Implement gamification for OhMyGold.

CONTEXT: Gamification drives habit formation and retention. Badges, streaks, and rewards keep members engaged.

TASK:
1. Badge system:
   - Categories: First Steps, Attendance Warrior, Class Master, Social, Challenge Champion
   - Examples:
     * First Steps: First Check-in, First Class, Profile Complete
     * Attendance: 10/50/100/500 Check-ins, Early Bird, Night Owl
     * Classes: Yoga Master, HIIT Hero, Class Explorer
     * Streaks: 7-Day Streak, 30-Day Streak, 100-Day Streak
     * Social: Team Player, Challenge Winner
   - Rarity: Common, Rare, Epic, Legendary
   - Icon: SVG badge designs per category

2. Streaks:
   - Daily check-in required
   - Current streak and longest streak
   - Streak freeze: 1 per month (prevents loss on missed day)
   - Streak recovery: pay to restore (optional)
   - Streak milestone celebrations

3. XP system:
   - Check-in: 10 XP
   - Book class: 5 XP
   - Attend class: 20 XP
   - Complete challenge: 100 XP
   - Social share: 15 XP
   - Level thresholds: 100, 250, 500, 1000, 2000...

4. Reward shop:
   - Redeem points for: free day pass, merchandise discount, PT session discount
   - Point cost per reward
   - Redemption tracking

5. Triggers:
   - Database triggers on check_in, booking, attendance
   - Check badge criteria after each action
   - Award badge + XP if criteria met
   - Send push notification

REQUIREMENTS:
- 20+ badges at launch
- Retroactive calculation for existing members
- Streak freeze mechanic
- XP for all actions
- Push notification on achievement
- French and English badge names

FILES TO CREATE:
- supabase/migrations/00000000000062_badges.sql
- supabase/migrations/00000000000063_member_achievements.sql
- supabase/migrations/00000000000064_streaks.sql
- supabase/functions/gamification/index.ts

VERIFICATION STEPS:
1. Award badges for test actions
2. Streak increments on daily check-in
3. XP awarded for actions
4. Level up at threshold
5. Reward redemption works
6. Push notification on achievement

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Badges created: ___
- Categories: ___
- XP system: Yes/No
- Reward shop: Yes/No
```

---

## 7.5 Wearable Integrations (Apple Health, Google Fit, Fitbit)

### Description and Scope
Integrate wearable fitness platforms: Apple Health (iOS), Google Fit (Android), and Fitbit. Sync workout data, heart rate, calories burned, and activity rings. Display wearable data in member profiles and use for personalized recommendations.

### Why This Matters
Wearable integration is expected by modern fitness app users. Apple Health and Google Fit are pre-installed on billions of devices. Syncing workout data provides a complete fitness picture — gym workouts + outdoor activities + daily activity. This data also feeds the recommendation engine and gamification system.

### Technical Approach
Apple Health: react-native-health for iOS. Google Fit: react-native-google-fit for Android. Fitbit: OAuth + Fitbit Web API. Request permissions for workout, heart rate, calories. Background sync: periodic data pull. Display: activity rings, workout history, heart rate zones. Privacy: member controls what data to share, GDPR-compliant.

### Files/Directories to Create/Modify
```
apps/mobile/src/
├── lib/
│   ├── appleHealth.ts       # Apple Health integration
│   ├── googleFit.ts         # Google Fit integration
│   └── fitbit.ts            # Fitbit OAuth + API
├── hooks/
│   └── useWearableData.ts
└── app/(app)/settings/
    └── wearables.tsx        # Wearable connection settings
```

### Dependencies on Other Items
- 6.1 (mobile app scaffolding)
- Phase 4 (member profile)

### Success Criteria
```
[ ] Apple Health: read workouts, heart rate, calories (iOS)
[ ] Google Fit: read activity, heart rate, calories (Android)
[ ] Fitbit: OAuth connection, sync activity data
[ ] Permission request: explain what data is accessed
[ ] Data display: activity summary in profile
[ ] Workout sync: gym sessions recorded to wearable
[ ] Heart rate zones: display in workout history
[ ] Calorie tracking: combined gym + wearable
[ ] Disconnect: member can revoke access anytime
[ ] GDPR: explicit consent, data minimization
[ ] Background sync: daily data pull
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Implement wearable integrations for OhMyGold mobile app.

CONTEXT: Sync fitness data from Apple Health, Google Fit, and Fitbit for a complete fitness picture.

TASK:
1. Apple Health (iOS):
   - react-native-health
   - Request permissions: workouts, heart rate, active energy
   - Read workout data
   - Read heart rate during workouts
   - Write gym workouts (check-in + class attendance)

2. Google Fit (Android):
   - react-native-google-fit
   - Request OAuth scopes: fitness.activity.read, fitness.heart_rate.read
   - Read sessions and heart rate
   - Write gym workout sessions

3. Fitbit:
   - OAuth authorization
   - Fitbit Web API: activities, heart rate, sleep
   - Background sync via scheduled job
   - Token refresh handling

4. Data display:
   - Profile: weekly activity summary
   - Workout detail: heart rate graph (if available)
   - Combined stats: gym + outdoor workouts
   - Calorie burn comparison

5. Settings:
   - Connect/disconnect each wearable
   - Permission management
   - Data sync frequency
   - Privacy controls

REQUIREMENTS:
- Explicit consent for each data type
- GDPR compliant
- Member can disconnect anytime
- Background sync daily
- Handle permission denial gracefully

REFERENCE:
- Research §5.2 (Wearables): /mnt/agents/output/ohmygold/team2_resamania_analysis/research/05_technical_best_practices.md
- New Features §6: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/03_new_features_proposals.md

FILES TO CREATE:
- apps/mobile/src/lib/appleHealth.ts
- apps/mobile/src/lib/googleFit.ts
- apps/mobile/src/lib/fitbit.ts
- apps/mobile/src/hooks/useWearableData.ts
- apps/mobile/src/app/(app)/settings/wearables.tsx

VERIFICATION STEPS:
1. Connect Apple Health → data synced
2. Connect Google Fit → data synced
3. Connect Fitbit → data synced
4. Workout data displays in profile
5. Heart rate graph renders
6. Disconnect → data removed

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Wearables: Apple Health/Yes, Google Fit/Yes, Fitbit/Yes
- Data types synced: ___
- Background sync: Yes/No
- GDPR consent: Yes/No
```

---

## 7.6 Video Content Platform (On-Demand Classes)

### Description and Scope
Build an on-demand video content platform: upload workout videos, organize by category and difficulty, stream with adaptive bitrate, track viewing progress, and integrate with member subscriptions. Premium content for higher-tier members.

### Why This Matters
Hybrid fitness is the default model post-COVID. Members expect on-demand content alongside live classes. Gold's Gym specifically embraces hybrid fitness. Video content is an additional revenue stream (premium subscription tier) and a retention tool — members engage even when they can't visit the gym.

### Technical Approach
Video storage: Supabase Storage or CDN (Cloudflare Stream). Upload: chunked upload for large files. Streaming: HLS with adaptive bitrate. Player: expo-av (React Native), custom web player. Categories: by type, difficulty, duration, instructor. Progress tracking: resume from where left off. Premium gating: check subscription tier before playback. Analytics: views, completion rate, popular content.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000066_video_content.sql
└── 00000000000067_video_categories.sql
supabase/functions/videos/
apps/mobile/src/app/(app)/
└── videos/
    ├── index.tsx            # Video library
    ├── [id].tsx             # Video player
    └── categories.tsx       # Browse by category
```

### Dependencies on Other Items
- Phase 4 (membership plans for premium gating)
- 6.1 (mobile app)

### Success Criteria
```
[ ] Video upload: chunked, progress indicator
[ ] Video categories: Yoga, HIIT, Strength, Cardio, Stretching
[ ] Difficulty levels: Beginner, Intermediate, Advanced
[ ] Streaming: adaptive bitrate, fast start
[ ] Video player: play, pause, seek, fullscreen
[ ] Progress tracking: resume from last position
[ ] Premium gating: check membership tier
[ ] Related videos: recommend similar content
[ ] Favorites: save videos for later
[ ] Download for offline viewing
[ ] View analytics: watch time, completion rate
[ ] Cast to TV (AirPlay, Chromecast)
```

### Estimated Effort
5-6 days

### LLM Agent Launch Prompt

```
Implement the video content platform for OhMyGold.

CONTEXT: On-demand workout videos as part of hybrid fitness offering. Premium content for higher-tier members.

TASK:
1. Video content system:
   - Videos table: title, description, instructor_id, category, difficulty, duration, thumbnail_url, video_url, is_premium
   - Categories: Yoga, HIIT, Strength, Cardio, Stretching, Mindfulness
   - Difficulty: Beginner, Intermediate, Advanced
   - Tags: for search and recommendations

2. Video player:
   - Mobile: expo-av
   - Web: HTML5 video with custom controls
   - Features: play, pause, seek, speed (0.5x-2x), fullscreen
   - Progress tracking: save position every 5 seconds
   - Resume from last position

3. Content library:
   - Grid view with thumbnails
   - Filter: category, difficulty, duration, instructor
   - Search: by title, instructor, tags
   - Related videos section
   - Favorites: save for later
   - Download for offline (mobile)

4. Premium gating:
   - Check member's plan tier
   - Basic members: limited free content
   - Premium members: full access
   - Upgrade prompt for premium content

5. Upload (admin):
   - Chunked upload (large files)
   - Progress bar
   - Thumbnail auto-generation
   - Metadata: title, description, category, difficulty

REQUIREMENTS:
- Streaming: HLS, adaptive bitrate
- Resume playback
- Offline download
- Premium content gating
- Cast to TV (future)

FILES TO CREATE:
- supabase/migrations/00000000000066_video_content.sql
- supabase/functions/videos/index.ts
- apps/mobile/src/app/(app)/videos/index.tsx
- apps/mobile/src/app/(app)/videos/[id].tsx
- Web video player component

VERIFICATION STEPS:
1. Upload video → appears in library
2. Stream video → smooth playback
3. Resume from last position
4. Premium gating works
5. Download for offline
6. Search and filter

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Video categories: ___
- Player: expo-av/Yes
- Offline download: Yes/No
- Premium gating: Yes/No
```

---

## 7.7 Nutrition Tracking Module

### Description and Scope
Build a nutrition tracking module: food logging with database, macro tracking (protein, carbs, fat, calories), meal planning, water intake tracking, and integration with wearable calorie burn data. Help members achieve holistic fitness goals.

### Why This Matters
"You can't out-train a bad diet." Nutrition is inseparable from fitness for members with weight or body composition goals. Research identified nutrition tracking as a differentiating feature. Integration with workout data (calories burned) provides a complete energy balance picture.

### Technical Approach
Food database: USDA or Open Food Facts API. Food logging: search → select portion → log. Macro tracking: daily totals vs goals. Meal planning: plan meals for the week. Water tracker: tap to add glass. Integration: calories burned from wearable + gym vs calories consumed. Charts: macro breakdown, calorie trend over time.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000068_nutrition_logs.sql
├── 00000000000069_meal_plans.sql
└── 00000000000070_water_tracker.sql
apps/mobile/src/app/(app)/
└── nutrition/
    ├── index.tsx            # Nutrition dashboard
    ├── log.tsx              # Food logging
    └── water.tsx            # Water tracker
```

### Dependencies on Other Items
- 7.5 (wearable data for calorie burn)
- Phase 4 (member profile for goals)

### Success Criteria
```
[ ] Food database: search 100,000+ foods
[ ] Food logging: search → select → log with portion
[ ] Macro tracking: protein, carbs, fat, calories
[ ] Daily totals vs goals
[ ] Meal planning: plan weekly meals
[ ] Water intake tracker: tap to log
[ ] Calorie balance: consumed vs burned
[ ] Barcode scanner for packaged foods
[ ] Custom food/recipe creation
[ ] Nutrition history: trends and charts
[ ] Goal integration: nutrition targets from fitness goals
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Implement nutrition tracking for OhMyGold.

CONTEXT: Nutrition tracking complements workout data for holistic fitness goals.

TASK:
1. Food logging:
   - Search food database (Open Food Facts API)
   - Select portion size
   - Log to meal (breakfast, lunch, dinner, snack)
   - Quick-add recent foods
   - Barcode scanner for packaged foods

2. Macro tracking:
   - Daily totals: protein, carbs, fat, calories
   - Goals: set targets per macro
   - Progress: circular progress indicators
   - History: weekly/monthly trends

3. Meal planning:
   - Plan meals for the week
   - Save meal templates
   - Generate shopping list
   - Nutrition preview before logging

4. Water tracker:
   - Tap glass icon to add
   - Daily goal: 8 glasses (configurable)
   - Reminder notifications
   - Weekly average

5. Calorie balance:
   - Consumed (from food logging)
   - Burned (from wearable + gym)
   - Net: deficit/surplus
   - Trend chart

REQUIREMENTS:
- Food database: 100K+ items
- Barcode scanning
- Macro goals
- Water reminders
- Wearable calorie integration

FILES TO CREATE:
- supabase/migrations/00000000000068_nutrition_logs.sql
- apps/mobile/src/app/(app)/nutrition/index.tsx
- apps/mobile/src/app/(app)/nutrition/log.tsx
- apps/mobile/src/app/(app)/nutrition/water.tsx

VERIFICATION STEPS:
1. Search and log food
2. Macro totals calculate correctly
3. Water tracker increments
4. Calorie balance with wearable data
5. Barcode scan adds food

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Food database source: ___
- Macros tracked: protein/carbs/fat/calories/Yes
- Water tracker: Yes/No
- Wearable integration: Yes/No
```

---

## 7.8 Social Feed and Member Connections

### Description and Scope
Build a social feed where members can share achievements, post updates, follow each other, and interact through likes and comments. Moderation tools for staff. Privacy controls for members.

### Why This Matters
Social connection is the strongest retention driver. Members who make friends at the gym stay significantly longer. A social feed creates a sense of community even when members aren't physically at the gym. Achievement sharing celebrates milestones and inspires others.

### Technical Approach
Posts table with content, media, author. Feed: chronological + algorithmic (prioritize friends, achievements). Likes and comments. Follow system: members follow each other. Privacy: public, friends-only, private. Moderation: staff can hide/remove posts. Reporting: members can report inappropriate content. Achievement posts: auto-generated on badge earn.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000071_social_posts.sql
├── 00000000000072_social_interactions.sql
└── 00000000000073_follows.sql
apps/mobile/src/app/(app)/
└── social/
    ├── feed.tsx             # Social feed
    ├── [postId].tsx         # Post detail
    └── profile/
        └── [userId].tsx     # Member public profile
```

### Dependencies on Other Items
- 7.4 (gamification — achievement posts)
- Phase 4 (member profiles)

### Success Criteria
```
[ ] Social feed: chronological + algorithmic
[ ] Post types: text, photo, achievement share
[ ] Likes and comments
[ ] Follow/unfollow members
[ ] Privacy: public, friends-only, private
[ ] Achievement auto-posts on badge earn
[ ] Member search and discovery
[ ] Public member profiles
[ ] Content moderation: staff can hide/remove
[ ] Report inappropriate content
[ ] Push notifications: likes, comments, follows
[ ] French and English
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Implement social feed and member connections for OhMyGold.

CONTEXT: Social features drive retention. Members share achievements, connect, and build community.

TASK:
1. Posts:
   - Table: id, author_id, content, media_url, type, created_at
   - Types: text, photo, achievement_share
   - Achievement auto-post: on badge earn, streak milestone
   - Media: single photo support

2. Feed:
   - Chronological (default)
   - Algorithmic: prioritize followed members + achievements
   - Pagination: infinite scroll
   - Pull-to-refresh

3. Interactions:
   - Like/unlike
   - Comments: nested (1 level)
   - Like count, comment count

4. Follow system:
   - Follow/unfollow member
   - Follower count, following count
   - Feed filtered by followed members option

5. Privacy:
   - Settings: public, friends-only, private
   - Public profile: badges, streaks, achievements
   - Private: only name and avatar visible

6. Moderation:
   - Staff can hide/remove posts
   - Report post/comment
   - Community guidelines

REQUIREMENTS:
- Content moderation
- Privacy controls
- Achievement auto-posts
- Push notifications on interactions
- French and English

FILES TO CREATE:
- supabase/migrations/00000000000071_social_posts.sql
- apps/mobile/src/app/(app)/social/feed.tsx
- apps/mobile/src/app/(app)/social/[postId].tsx
- apps/mobile/src/app/(app)/social/profile/[userId].tsx

VERIFICATION STEPS:
1. Create post → appears in feed
2. Like and comment
3. Follow member → feed updates
4. Achievement auto-post
5. Report content
6. Privacy settings work

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Features: posts/likes/comments/follows/Yes
- Privacy levels: ___
- Moderation: Yes/No
```

---

## 7.9 Advanced Analytics (Predictive, Cohort Analysis)

### Description and Scope
Implement advanced analytics: cohort analysis (member retention by join month), predictive forecasting (revenue, attendance), funnel analysis (visitor → trial → member), lifetime value calculation, and automated insight generation. For Admin and Manager dashboards.

### Why This Matters
Advanced analytics turn data into strategic insights. Cohort analysis reveals which acquisition months produced the most loyal members. Predictive forecasting helps with staffing and budgeting. Funnel analysis identifies conversion bottlenecks. These capabilities elevate OhMyGold from operational tool to strategic platform.

### Technical Approach
Cohort analysis: group members by join month, track retention over time. Predictive: time-series forecasting using historical trends. Funnel: track visitor → trial signup → trial attendance → membership conversion. LTV: average revenue per member × average retention. Insights: auto-generated text summaries of key trends. Charts: cohort heatmap, forecast lines, funnel visualization.

### Files/Directories to Create/Modify
```
supabase/functions/advanced-analytics/
├── index.ts                 # Analytics API
├── cohort-analysis.ts       # Cohort retention
├── forecasting.ts           # Predictive models
├── funnel-analysis.ts       # Conversion funnel
└── insights.ts              # Auto-generated insights
apps/web/src/pages/manager/
└── advanced-analytics.tsx
```

### Dependencies on Other Items
- Phase 4 (all operational data)
- 7.1 (churn data)

### Success Criteria
```
[ ] Cohort analysis: retention by join month (heatmap)
[ ] Cohort comparison: which months had best retention
[ ] Revenue forecasting: next 3 months prediction
[ ] Attendance forecasting: peak hours prediction
[ ] Funnel analysis: visitor → trial → member conversion
[ ] Funnel stage drop-off identification
[ ] Lifetime value calculation per member and segment
[ ] Automated insights: "Revenue up 15% vs last month"
[ ] Export: cohort data, forecasts, funnel metrics
[ ] Dashboard: all advanced analytics in one view
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Implement advanced analytics for OhMyGold.

CONTEXT: Advanced analytics provide strategic insights: cohorts, forecasting, funnels, and LTV.

TASK:
1. Cohort analysis:
   - Group members by join month
   - Track retention: % active at month 1, 3, 6, 12
   - Heatmap visualization
   - Identify best/worst cohorts
   - Compare by: source, plan type, location

2. Predictive forecasting:
   - Revenue: next 3 months based on trends
   - Attendance: predict peak hours, busy days
   - Membership: predict new signups
   - Method: time-series (moving average + trend)

3. Funnel analysis:
   - Visitor → Trial Signup → Trial Attendance → Member
   - Stage conversion rates
   - Drop-off identification
   - A/B test different conversion strategies

4. Lifetime value:
   - Formula: avg_monthly_revenue × avg_retention_months
   - By plan type, by source, by location
   - CAC vs LTV ratio
   - Member segment value ranking

5. Auto-insights:
   - Generate natural language summaries
   - "Member retention improved 12% this month"
   - Highlight anomalies and trends
   - Weekly insight email to managers

REQUIREMENTS:
- Cohort heatmap chart
- Forecast confidence intervals
- Funnel visualization
- LTV by segment
- Automated insight generation

FILES TO CREATE:
- supabase/functions/advanced-analytics/index.ts
- apps/web/src/pages/manager/advanced-analytics.tsx

VERIFICATION STEPS:
1. Cohort heatmap renders
2. Forecast matches historical trends
3. Funnel shows conversion rates
4. LTV calculates correctly
5. Insights generated automatically

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Analytics: cohorts/Yes, forecasting/Yes, funnel/Yes, LTV/Yes
- Insight examples: ___
```

---

## 7.10 IoT Equipment Integration

### Description and Scope
Build IoT integration framework for gym equipment: connect cardio machines (treadmills, bikes), track usage data, display equipment status, enable maintenance alerts, and provide usage analytics. API-first design for future hardware partnerships.

### Why This Matters
IoT-enabled equipment is the future of gym management. Connected treadmills can report usage hours (triggering maintenance alerts), workout data (feeding member profiles), and availability status (reducing wait times). This positions OhMyGold as a forward-thinking platform ready for smart gym partnerships.

### Technical Approach
API-first: define equipment data interface (status, usage_hours, workout_data). MQTT or WebSocket for real-time data. Equipment gateway: Edge Function that receives data from equipment. Status dashboard: which machines are in use, which need maintenance. Usage analytics: peak usage times, most popular equipment. Maintenance alerts: when usage hours exceed threshold. Integration hooks: documented API for equipment vendors.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000074_iot_equipment.sql
└── 00000000000075_equipment_data.sql
supabase/functions/iot/
├── index.ts                 # IoT data ingestion
└── equipment-gateway.ts     # Equipment vendor API
apps/web/src/pages/manager/
└── equipment-iot.tsx
```

### Dependencies on Other Items
- Phase 4 (equipment inventory)
- 4.1 (location management)

### Success Criteria
```
[ ] Equipment data model: status, usage_hours, workout_data
[ ] Real-time status: in_use, available, maintenance_needed, offline
[ ] Usage tracking: hours logged, sessions count
[ ] Maintenance alerts: push when threshold exceeded
[ ] Status dashboard: floor plan with equipment status
[ ] Usage analytics: peak times, popular equipment
[ ] API documentation for equipment vendors
[ ] WebSocket/MQTT for real-time updates
[ ] Historical usage data
[ ] Integration with existing equipment inventory
```

### Estimated Effort
3-4 days

### LLM Agent Launch Prompt

```
Implement IoT equipment integration for OhMyGold.

CONTEXT: API-first IoT framework for connected gym equipment. Future-proof the platform for smart gym partnerships.

TASK:
1. Equipment data model:
   - iot_equipment: equipment_id, serial_number, model, location_id, zone_id
   - equipment_status: status (in_use, available, maintenance_needed, offline), last_updated
   - equipment_usage: usage_hours, session_count, last_session
   - equipment_workouts: member_id, start_time, end_time, calories, heart_rate_data

2. Data ingestion:
   - Edge Function: receive data from equipment
   - MQTT or WebSocket for real-time
   - REST API fallback for batch data
   - Authentication: API keys per equipment vendor

3. Status dashboard:
   - Floor plan view with equipment status (color-coded)
   - List view: sort by status, usage, last maintenance
   - Real-time updates (Supabase Realtime)
   - Alert feed: maintenance needed, offline

4. Maintenance:
   - Alert when usage_hours > threshold
   - Predictive maintenance: usage trend analysis
   - Maintenance log
   - Integration with issue reporting

5. Vendor API:
   - Documented REST API for equipment manufacturers
   - Authentication: API key
   - Data format specification
   - Webhook for real-time updates

REQUIREMENTS:
- API-first design
- Real-time status updates
- Maintenance alerts
- Vendor integration documentation
- Extensible for new equipment types

FILES TO CREATE:
- supabase/migrations/00000000000074_iot_equipment.sql
- supabase/functions/iot/index.ts
- apps/web/src/pages/manager/equipment-iot.tsx

VERIFICATION STEPS:
1. Ingest simulated equipment data
2. Status dashboard shows real-time updates
3. Maintenance alert triggered
4. API documentation complete
5. Floor plan renders equipment status

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Equipment types supported: ___
- Real-time protocol: MQTT/WebSocket/___
- Vendor API documented: Yes/No
```

---

## Phase 7 Completion Checklist

```
[ ] 7.1 AI churn prediction: > 70% accuracy, risk scores, interventions
[ ] 7.2 Smart recommendations: > 20% CTR, explainable
[ ] 7.3 Community features: challenges, leaderboards, teams
[ ] 7.4 Gamification: 20+ badges, streaks, XP, reward shop
[ ] 7.5 Wearable integrations: Apple Health, Google Fit, Fitbit
[ ] 7.6 Video content: streaming, categories, premium gating
[ ] 7.7 Nutrition tracking: food logging, macros, water
[ ] 7.8 Social feed: posts, likes, comments, follows, moderation
[ ] 7.9 Advanced analytics: cohorts, forecasting, funnels, LTV
[ ] 7.10 IoT integration: equipment status, maintenance, vendor API
[ ] All features consume Phase 4 data correctly
[ ] Privacy: all personal data uses handled per GDPR
[ ] Performance: no feature adds > 200ms to load time
[ ] Integration points documented for future enhancements
```

---

*Phase 7 notes: These are the features that differentiate OhMyGold. AI, community, gamification, and wearables transform the platform from a management tool into an engagement ecosystem. Each feature builds on the core data from Phase 4. The key success metric is member engagement — are members booking more classes, maintaining streaks, and staying longer because of these features?*
