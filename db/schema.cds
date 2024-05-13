namespace janisdombrovskis_vass.budget_planner_app;

entity Incomes {
  key ID : UUID;
  user : String;
  amount : Decimal(10,2);
  category : String;
  date : Date;
  description : String;
  static : String;
}

entity Expenses {
  key ID : UUID;
  user : String;
  amount : Decimal(10,2);
  category : String;
  date : Date;
  description : String;
  static : String;
}

entity Users {
  key ID : String;
  name : String;
}

entity Savings {
  key ID : String;
  user : String;
  amount : Decimal(10,2);
}
