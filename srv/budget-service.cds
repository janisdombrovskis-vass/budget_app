using { janisdombrovskis_vass.budget_planner_app } from '../db/schema';

service BudgetService {
  entity Incomes as projection on budget_planner_app.Incomes;
  entity Expenses as projection on budget_planner_app.Expenses;
  entity Categories as projection on budget_planner_app.Categories;
}
