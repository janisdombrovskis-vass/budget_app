namespace janisdombrovskis_vass.budget_planner_app;

entity Incomes {
  key ID : UUID;
  amount : Decimal(10,2);
  category : String;
  date : Date;
  description : String;
  static : String;
}

entity Expenses {
  key ID : UUID;
  amount : Decimal(10,2);
  category : String;
  date : Date;
  description : String;
  static : String;
}

entity Categories {
  key ID : UUID;
  name : String;
  type : String; // "Income" or "Expense"
}
