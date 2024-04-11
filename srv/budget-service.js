const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
  const { Incomes, Expenses } = this.entities;

  this.after('READ', [Incomes, Expenses], records => {
    records.forEach(record => {
      record.description = record.description || "No description provided";
    });
  });

  // Implement any additional logic you need for your app here
});
