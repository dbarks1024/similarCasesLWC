import { LightningElement, wire, track, api } from 'lwc';
import getSimilarCases from '@salesforce/apex/SimilarCasesController.getSimilarCases';

const COLS = [
  { label: 'Case Number', fieldName: 'caseUrl', type: 'url', typeAttributes: {label: {fieldName: 'CaseNumber'}}, target : '_blank'},
  { label: 'Subject', fieldName: 'Subject'},
  { label: 'Parent Case', fieldName: 'parentUrl', type: 'url', typeAttributes: {label: {fieldName: 'parentCaseNumber'}}, target : '_blank' },
  { label: 'Description', fieldName: 'Description'}
];

export default class SimilarCases extends LightningElement {
  @track error;
  @track columns = COLS;
  @api recordId = null;
  @track similarCases = [];
  @track parentSimilarCases = [];
  @track noSimilarCases = true;
  @track noParentSimilarCases = true;

  @wire(getSimilarCases, { recordId: '$recordId' }) 
  wiredCases(result){
    const { data, error } = result;
    if(data){
      if(data.similarCases.length > 0){
        this.similarCases = this.formatCases(data.similarCases);
        this.noSimilarCases = false;
      }      
      if(data.parentSimilarCases.length > 0){
        this.parentSimilarCases = this.formatCases(data.parentSimilarCases);
        this.noParentSimilarCases = false;
      } 
      this.error = null;
    }
    if(error){
      this.error = error;
    }
  };

  formatCases(data) {
    let caseUrl;
    let parentUrl = null;
    let parentCaseNumber = null;  
    return data.map(c => {
      caseUrl = `/${c.Id}`;
      if(c.ParentId) {
        parentUrl = `/${c.ParentId}`;
        parentCaseNumber = c.Parent.CaseNumber;
      }
      return {...c, caseUrl, parentUrl, parentCaseNumber}
    }) 
  }
}