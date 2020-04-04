import { LightningElement, wire, track, api } from 'lwc';
import getSimilarCases from '@salesforce/apex/SimilarCasesController.getSimilarCases';
// import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
// import CASE_NUMBER_FIELD from '@salesforce/schema/Case.CaseNumber';
// import PARENT_CASE_NUMBER_FIELD from '@salesforce/schema/Case.Parent_Case_Number__c';
// import DESCRIPTION_FIELD from '@salesforce/schema/Case.Description';

const COLS = [
  { label: 'Case Number', fieldName: 'caseUrl', type: 'url', typeAttributes: {label: {fieldName: 'CaseNumber'}}, target : '_blank'},
  { label: 'Subject', fieldName: 'Subject'},
  { label: 'Parent Case', fieldName: 'parentUrl', type: 'url', typeAttributes: {label: {fieldName: 'Parent.CaseNumber'}}, target : '_blank' },
  { label: 'Description', fieldName: 'Description'}
];

export default class SimilarCases extends LightningElement {
  @track error;
  @track columns = COLS;
  @api recordId = null;
  @track similarCases = [];
  @track parentSimilarCases = [];

  @wire(getSimilarCases, { recordId: '$recordId' }) 
  wiredCases(result){
    const { data, error } = result;
    if(data){
      let caseUrl;
      let parentUrl = null;
      this.similarCases = data.similarCases.map(c => {
        caseUrl = `/${c.Id}`;
        if(c.ParentId) {
          parentUrl = `/${c.ParentId}`;
        }
        return {...c, caseUrl, parentUrl}
      })
      this.parentSimilarCases = data.parentSimilarCases.map(c => {
        caseUrl = `/${c.Id}`;
        if(c.ParentId){
          parentUrl = `/${c.ParentId}`;
        }
        return {...c, caseUrl, parentUrl}
      })
      this.error = null;
    }
    if(error){
      this.error = error;
    }
  };
}