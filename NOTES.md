# Reflection Notes

1. Which parts did you build with AI assistance, and where did you have to correct, override, or rewrite what it produced?
- The initial CRUD structure, route layout, and page scaffolding were generated with AI assistance.
- The parts I had to correct were the repository exports and a few data-flow issues in the backend so the controllers could call the repository methods reliably.

2. Briefly describe your database schema and one tradeoff you made in designing it.
- The schema is simple: a `categories` table and an `expenses` table.
- Each expense points to a category through `category_id`, and the database prevents deleting a category while expenses still reference it.
- The tradeoff was keeping the schema minimal and using SQLite instead of introducing a more complex setup for multi-tenant or historical reporting needs.

3. What would break first if this app had to handle ~1,000,000 expenses, and what would you change?
- The first bottleneck would be query performance, especially on list and summary endpoints.
- I would add indexes on `expenses.expense_date` and `expenses.category_id`, tighten pagination, and move heavy aggregate reporting to a separate background process or precomputed store.

4. What did you deliberately simplify or leave out given the time limit, and why?
- I kept the UI minimal and left out authentication, user roles, and richer analytics.
- Those were not required for the core assignment and would have added scope without improving the core expense tracking workflow.
