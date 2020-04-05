public with sharing class SimilarCasesController {
    @AuraEnabled(cacheable=true)
    public static Map<String, List<Case>> getSimilarCases(String recordId){
        // todo- add first 15
        Case originalCase = [SELECT Id, Subject, Subject_No_Loop_Protection__c, ParentId FROM Case WHERE Id = :recordId LIMIT 1];
        String subjectSearch = '%' + originalCase.Subject + '%';
        String subjectFirst10Search = '%' + originalCase.Subject.left(15) + '%';
        Map<String,Case[]> foundCases = new Map<String,Case[]>(); 
        String baseQuery = 'SELECT Id, Subject, Subject_No_Loop_Protection__c, ParentId, Description, CaseNumber, Parent.CaseNumber FROM Case ';
        String similarCasesCriteria = 'WHERE (Subject_No_Loop_Protection__c LIKE :subjectSearch OR Subject_No_Loop_Protection__c LIKE :subjectFirst10Search) AND Id != :recordId';
        List<Case> foundSimilarCases = Database.query(baseQuery + similarCasesCriteria);
        Set<Id> foundSimilarCasesParentIds = new Set<Id>();
        for (Case c : foundSimilarCases) {
            if(c.ParentId != null){
                foundSimilarCasesParentIds.add(c.ParentId);
            }
        }
        foundCases.put('similarCases', foundSimilarCases);
        String parentCasesCriteria = 'WHERE Id IN :foundSimilarCasesParentIds AND Id != :recordId';
        foundCases.put('parentSimilarCases', Database.query(baseQuery + parentCasesCriteria));
        return foundCases;
    }
}
