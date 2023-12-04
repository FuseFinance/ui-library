Cypress.Commands.add(
  'findInVersionTable',(VersionName: string, tableType: string) => {
    try {
      let retryCount = 0;
      const searchItem = () => {
        cy.get(tableType)
        .then($table => {
            const row = $table.find(`p:contains("${VersionName}")`)
            const exist = row.length !== 0
            if (!exist) {
                retryCount++;
                if(retryCount > 20) {
                  return null
                }
                
                cy.get(tableType)
                  .find('li.ant-pagination-next')
                  .click();
                searchItem();
            }else{
              return cy.get("p").contains(VersionName)
            }
        } );
    }

      return searchItem()
    } catch (error) {
      cy.log(error)
    }
  }
)

