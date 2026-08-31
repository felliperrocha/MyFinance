file:///d%3A/MyFinance/prompt1.md {"mtime":1788128292514,"ctime":1788128292514,"size":0,"etag":"3gj4ab4ih0","orphaned":false,"typeId":""}
# MYFINANCE — COMPLETE PROJECT DEVELOPMENT PROMPT

Build a complete, modern and functional personal financial management web application called **MyFinance**.

The application must be designed as a sophisticated financial planning platform, not as a generic expense tracker. Its main purpose is to help users organize their finances, monitor their spending, define financial goals, track progress visually, create strategies, manage budgets, and simulate different financial scenarios.

The application must be fully functional, with persistent data storage using **Neon PostgreSQL**.

---

# 1. PROJECT OBJECTIVE

Create a personal financial management platform where users can:

* Register income and expenses;
* Create and manage custom expense categories;
* Monitor monthly budgets;
* Define financial goals;
* Track goal progress visually through percentages and progress indicators;
* Register contributions toward financial goals;
* Create manual strategies to achieve goals;
* Perform financial simulations;
* Receive automatic insights based on financial rules and calculations;
* Access a sophisticated dashboard with a complete overview of their financial situation.

The application should feel like a premium financial planning product.

It must prioritize:

* Simplicity;
* Visual clarity;
* Sophistication;
* Organization;
* High-quality user experience;
* Clear data visualization.

---

# 2. VISUAL IDENTITY

The visual identity is extremely important.

The interface must NOT look like an AI application.

Avoid:

* Futuristic visuals;
* Neon colors;
* Excessive gradients;
* Colorful dashboards;
* Excessive animations;
* Flashy visual effects;
* Generic AI aesthetics;
* Excessive use of emojis.

The visual style should feel similar to a premium modern financial platform.

## Color palette

Use primarily:

* Primary black: #0F0F0F
* Dark gray: #1F1F1F
* Medium gray: #6B6B6B
* Light gray: #E8E8E8
* Main background: #FAFAFA
* White: #FFFFFF

Accent colors should be used only when necessary for financial status indicators:

* Subtle green for positive progress;
* Subtle red for warnings or negative situations;
* Neutral gray for inactive or neutral information.

Do not use gradients.

---

# 3. TYPOGRAPHY

Use a clean and modern typography.

Preferred font:

**Inter**

Typography hierarchy:

* Main titles: Inter SemiBold or Bold;
* Section titles: Inter SemiBold;
* Interface text: Inter Regular or Medium;
* Secondary information: Inter Regular with subtle gray tones.

The interface should have generous spacing and excellent readability.

---

# 4. LOGO AND BRAND

Application name:

# MyFinance

The logo should be minimalist and sophisticated.

Create a simple abstract symbol based on the letter **M**, representing:

* Financial organization;
* Progress;
* Growth;
* Planning;
* Flow of information.

The symbol should also work independently as:

* Application icon;
* Favicon;
* Mobile icon;
* Sidebar icon.

Suggested brand concept:

**MyFinance**

Tagline:

**Planeje. Controle. Conquiste.**

The logo must follow the monochromatic identity.

---

# 5. MAIN APPLICATION LAYOUT

Use a responsive application layout.

On desktop:

* Fixed left sidebar;
* Main content area;
* Clean top header when necessary.

Suggested sidebar navigation:

MYFINANCE

Dashboard

Movimentações

Orçamento

Metas

Estratégias

Insights

Simulações

---

Configurações

Ajuda

The Categories section should not unnecessarily clutter the main sidebar. It can be accessed through Movimentações or Configurações.

On mobile:

Use a responsive layout with an optimized navigation system, preferably a bottom navigation bar for the most important sections.

---

# 6. DASHBOARD

The Dashboard must provide a complete financial overview.

At the top, display a simple greeting.

Example:

"Olá, [Nome]."

"Veja como está sua organização financeira."

Avoid excessive text.

---

## Financial summary cards

Display cards for:

### Current Balance

Show the current calculated balance.

### Monthly Income

Show the total income for the selected month.

### Monthly Expenses

Show total expenses for the selected month.

### Monthly Savings

Show how much money remains after income and expenses.

Use clean typography and visual hierarchy.

---

## Financial evolution

Include a professional chart showing:

* Income;
* Expenses;
* Savings.

Allow period filters:

* Week;
* Month;
* Year.

Charts must be minimalistic and easy to understand.

---

## Goal progress section

This must be one of the most visually important areas of the application.

Display the user's main financial goals with:

* Goal name;
* Current percentage;
* Current amount;
* Target amount;
* Remaining amount;
* Deadline;
* Status.

Example:

Reserve Fund

72%

R$ 14,400 of R$ 20,000

Status: On track

Use circular progress indicators for featured goals.

For additional goals, use clean horizontal progress bars.

Example:

Travel

45%

████████░░░░░░

Home

25%

████░░░░░░░░

Computer

90%

██████████████

Include a button:

"Ver todas as metas"

---

## Featured insight

Display a single automatic financial insight.

Example:

"Seus gastos com alimentação diminuíram 12% em relação ao mês anterior."

Button:

"Ver análise completa"

Insights should be visually subtle and integrated naturally into the interface.

---

# 7. MOVIMENTAÇÕES

Create a complete financial transactions section.

The user must be able to register:

* Income;
* Expenses.

Main actions:

* Nova receita

* Nova despesa

---

## Income registration

Fields:

* Description;
* Amount;
* Date;
* Income type;
* Recurrence.

Income types:

* Salary;
* Benefit;
* Extra income;
* Other.

Recurrence options:

* Monthly;
* One-time;
* Custom.

---

## Expense registration

Fields:

* Description;
* Amount;
* Category;
* Date;
* Payment method;
* Recurrence;
* Notes.

Payment methods may include:

* Cash;
* Debit card;
* Credit card;
* Bank transfer;
* Other.

---

## Transactions list

Display:

* Date;
* Description;
* Category;
* Type;
* Amount.

Allow the user to:

* Edit transactions;
* Delete transactions;
* View transaction details.

Include filters:

* Date range;
* Category;
* Income;
* Expense;
* Recurrence.

---

# 8. CATEGORIES

Create default expense categories:

* Housing;
* Food;
* Transportation;
* Health;
* Education;
* Leisure;
* Shopping;
* Financial;
* Other.

The user must be able to:

* Create custom categories;
* Edit custom categories;
* Delete custom categories.

Each category may have:

* Name;
* Optional icon;
* Type.

Keep icons minimal and consistent with the visual identity.

---

# 9. BUDGET

Create a monthly budget management section.

The user should be able to define spending limits for each category.

Example:

Food

Budget: R$ 800

Current spending: R$ 650

81% used

Display a visual progress indicator.

---

## Budget alerts

Generate automatic alerts when the user reaches:

* 50%;
* 80%;
* 100%.

Examples:

"You have reached 80% of your Food budget."

"You exceeded your Leisure budget."

The system should calculate budget usage automatically based on registered expenses.

---

# 10. FINANCIAL GOALS

This is one of the most important sections of the entire application.

The visual experience should focus heavily on:

* Progress;
* Percentage completion;
* Remaining amount;
* Deadlines;
* Status.

---

## Create goal

Fields:

* Goal name;
* Target amount;
* Current amount;
* Deadline;
* Priority.

Priority options:

* High;
* Medium;
* Low.

The system must automatically calculate:

Progress percentage:

(Current Amount ÷ Target Amount) × 100

Do not store the progress percentage unnecessarily if it can be calculated dynamically.

---

## Goal cards

Each goal should display:

* Goal name;
* Percentage completed;
* Current amount;
* Target amount;
* Remaining amount;
* Deadline;
* Priority;
* Status.

Statuses:

* On track;
* Attention needed;
* At risk;
* Completed.

---

## Goal details page

When opening a goal, display:

### Financial overview

* Target amount;
* Current amount;
* Remaining amount;
* Percentage;
* Deadline.

### Progress visualization

Use a large circular progress indicator.

### Contribution history

Display contributions made toward the goal.

The user must be able to register new contributions.

Each contribution should include:

* Amount;
* Date;
* Optional note.

---

## Goal forecast

Calculate a forecast based on the user's contribution history.

Example:

"At your current contribution rate, you may reach this goal in approximately 18 months."

This calculation must be based on actual stored data and mathematical rules.

---

# 11. STRATEGIES

Create a section where users can manually organize strategies to achieve their financial goals.

Strategies should be linked to goals.

Categories:

### Savings

Strategies focused on reducing or optimizing expenses.

Example:

Reduce unnecessary expenses.

Estimated monthly impact:

R$ 250.

---

### Organization

Strategies related to financial habits and planning.

Example:

Automatically transfer R$ 800 every month toward the goal.

---

### Investment

Strategies related to financial planning and investment approaches.

For this first version, do not provide AI investment recommendations.

Allow the user to manually register investment-related strategies.

Fields:

* Strategy name;
* Description;
* Strategy type;
* Related goal;
* Estimated monthly impact;
* Status.

Status:

* Active;
* Paused;
* Completed.

---

# 12. INSIGHTS

Create an intelligent insights section.

IMPORTANT:

Artificial Intelligence must NOT be implemented in this first version.

Insights should initially be generated using deterministic rules and calculations based on the user's stored financial data.

Examples:

### Spending behavior

"Your transportation expenses increased 15% compared to the previous month."

### Savings opportunity

"Your recurring expenses represent a significant portion of your monthly spending."

### Budget warning

"You exceeded your Leisure budget."

### Goal progress

"Your Reserve Fund goal is progressing faster than planned."

### Goal risk

"At your current contribution rate, you may not reach this goal by the selected deadline."

---

## Insight filters

Allow filtering by:

* All;
* Savings;
* Alerts;
* Goals;
* Financial behavior.

Each insight should include:

* Title;
* Description;
* Type;
* Date;
* Read/unread status.

---

# 13. SIMULATIONS

Create a financial simulation section.

Users should be able to test different scenarios.

Example:

Selected goal:

Reserve Fund.

Current amount:

R$ 14,400

Target:

R$ 20,000

Monthly contribution:

R$ 500

Estimated time:

12 months.

If the user changes the contribution:

R$ 800

The system should automatically recalculate the estimated completion time.

---

## Simulation options

Allow users to simulate:

* Increasing monthly contributions;
* Reducing expenses;
* Changing the deadline;
* Changing the target amount.

Display:

* Estimated completion date;
* Estimated time remaining;
* Required monthly contribution.

Use mathematical calculations only in this first version.

---

# 14. SETTINGS

Create a Settings section.

## Profile

* Name;
* Email.

## Financial preferences

* Currency;
* Financial month starting day;
* Display preferences.

## Notifications

Allow users to manage:

* Budget alerts;
* Goal updates;
* Insight notifications.

## Security

Include:

* Change password;
* Active sessions;
* Account protection options.

---

# 15. DATABASE — NEON POSTGRESQL

Use Neon PostgreSQL as the application's persistent database.

The application must use a secure backend connection.

Never expose database credentials in the frontend.

Use environment variables.

Example:

DATABASE_URL

---

## Suggested database entities

### users

* id
* name
* email
* password_hash
* created_at
* updated_at

---

### categories

* id
* user_id
* name
* icon
* type
* created_at

---

### income

* id
* user_id
* description
* amount
* date
* income_type
* recurrence
* created_at
* updated_at

---

### expenses

* id
* user_id
* category_id
* description
* amount
* date
* payment_method
* recurrence
* notes
* created_at
* updated_at

---

### budgets

* id
* user_id
* category_id
* monthly_limit
* month
* year
* created_at
* updated_at

---

### goals

* id
* user_id
* title
* target_amount
* current_amount
* deadline
* priority
* status
* created_at
* updated_at

---

### goal_contributions

* id
* goal_id
* amount
* contribution_date
* notes
* created_at

---

### strategies

* id
* user_id
* goal_id
* title
* description
* strategy_type
* estimated_monthly_impact
* status
* created_at
* updated_at

---

### insights

* id
* user_id
* title
* content
* insight_type
* created_at
* is_read

---

# 16. SECURITY REQUIREMENTS

Because this application handles personal financial information, security must be considered from the beginning.

Implement:

* Secure authentication;
* Password hashing;
* User session management;
* Authorization checks;
* User data isolation;
* Backend validation;
* Input sanitization;
* Environment variables for secrets;
* Secure database connection.

A user must never be able to access another user's:

* Expenses;
* Income;
* Goals;
* Strategies;
* Insights;
* Budgets.

All sensitive operations must be validated on the backend.

---

# 17. FUTURE ARTIFICIAL INTELLIGENCE INTEGRATION

IMPORTANT:

DO NOT IMPLEMENT ARTIFICIAL INTELLIGENCE IN THIS FIRST VERSION.

However, structure the application so that AI capabilities can be integrated in a future development phase.

The future AI integration will use a Google API key.

The API key must:

* Never be exposed in the frontend;
* Be stored securely using environment variables;
* Be accessed only through the backend.

Future architecture:

Frontend

↓

Secure Backend

↓

Google AI API

↓

Analysis and response

↓

MyFinance interface

The future AI will be responsible for:

* Personalized financial insights;
* Goal planning;
* Financial strategy suggestions;
* Spending behavior analysis;
* Scenario explanations;
* Assistance with financial planning.

For now, only prepare the application architecture for this future implementation.

Do not make the current interface look like an AI chatbot.

AI functionality must eventually be integrated naturally into:

* Goals;
* Strategies;
* Insights;
* Simulations.

---

# 18. RESPONSIVENESS

The application must be fully responsive.

Support:

* Desktop;
* Tablet;
* Mobile.

The mobile version must preserve:

* Goal progress visualization;
* Financial cards;
* Charts;
* Transaction management;
* Main navigation.

---

# 19. USER EXPERIENCE

Prioritize an intuitive user experience.

The primary user journey should be:

Register

↓

Access Dashboard

↓

Register Income and Expenses

↓

Organize Categories

↓

Define Budgets

↓

Create Financial Goals

↓

Track Progress

↓

Create Strategies

↓

Receive Insights

↓

Run Simulations

↓

Adjust Financial Planning

The application should help users understand their financial situation quickly and clearly.

---

# 20. FINAL DESIGN PRINCIPLES

The MyFinance application must communicate:

* Professionalism;
* Trust;
* Organization;
* Sophistication;
* Financial discipline;
* Progress;
* Long-term planning.

Avoid creating a generic banking interface.

Avoid creating an exaggerated fintech interface.

Avoid creating an AI-looking interface.

The design should feel:

**Minimal.**

**Sophisticated.**

**Modern.**

**Professional.**

**Data-driven.**

**Focused on financial goals and progress.**

The percentage and visual progress of financial goals should be one of the strongest visual elements throughout the application.

Build a polished, cohesive, production-quality experience with consistent components, spacing, typography, responsive behavior, and persistent data integration through Neon PostgreSQL.
