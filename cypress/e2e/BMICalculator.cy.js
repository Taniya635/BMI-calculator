/* eslint-disable no-undef */

import data from "../../submissionData.json"; // do not create this file

// const data = [{ submission_link: "http://localhost:3000", id: "shanti-local" }];

data.forEach(({ submission_link: url, id }) => {
  describe("Chakra UI BMI Calculator", function () {
    let acc_score = 1;

    beforeEach(() => {
      if (url.charAt(url.length - 1) != "/") {
        url = url + "/";
      }
    });

    it("displays the BMI calculator", () => {
      cy.visit(url);
      cy.contains("BMI Calculator");
      cy.get("input[type='number']").should("have.length", 2);
      cy.contains("Calculate");
      cy.contains("Reset");
      cy.get(".bmi-form").should("have.css", "grid");
      cy.then(() => {
        acc_score += 3;
      });
    });

    it("calculates BMI when 'Calculate' button is clicked for Healthy", () => {
      cy.get(".weight").type("70");
      cy.get(".height").type("170");
      cy.contains("Calculate").click();
      cy.get(".bmi-result").should("exist");
      cy.get(".bmi-result").should("have.css", "grid");
      cy.get(".bmi-value").should("contain", 24.22);
      cy.get(".bmi-status").should("contain", "Healthy");
      cy.get(".bmi-status").should("have.css", "color", "rgb(0, 128, 0)");

      cy.then(() => {
        acc_score += 2;
      });
    });

    it("calculates BMI when 'Calculate' button is clicked for Underweight", () => {
      cy.contains("Reset").click();
      cy.get(".weight").type("40");
      cy.get(".height").type("170");
      cy.contains("Calculate").click();
      cy.get(".bmi-value").should("contain", 13.84);
      cy.get(".bmi-status").should("contain", "Underweight");
      cy.get(".bmi-status").should("have.css", "color", "rgb(0, 0, 255)");

      cy.then(() => {
        acc_score += 1;
      });
    });

    it("calculates BMI when 'Calculate' button is clicked for Overweight", () => {
      cy.contains("Reset").click();
      cy.get(".weight").type("90");
      cy.get(".height").type("170");
      cy.contains("Calculate").click();
      cy.get(".bmi-value").should("contain", 31.14);
      cy.get(".bmi-status").should("contain", "Overweight");
      cy.get(".bmi-status").should("have.css", "color", "rgb(255, 0, 0)");

      cy.then(() => {
        acc_score += 1;
      });
    });

    it("resets form when 'Reset' button is clicked", () => {
      cy.get(".weight").type("70");
      cy.get(".height").type("170");
      cy.contains("Reset").click();
      cy.get(".weight").should("have.value", "");
      cy.get(".height").should("have.value", "");
      cy.get(".bmi-result").should("not.exist");

      cy.then(() => {
        acc_score += 2;
      });
    });

    it(`generate score`, () => {
      console.log("final score:", acc_score);
      ////////////// this should not be changed
      let result = {
        id,
        marks: Math.ceil(acc_score),
      };
      result = JSON.stringify(result);
      cy.writeFile("results.json", `\n${result},`, (err) => {
        if (err) {
          console.error(err);
        }
      });
      //////////////////
    });
  });
});
