public with sharing class SimilarCasesController {
    @AuraEnabled(cacheable=true)
    public static Map<String, List<Case>> getSimilarCases(String recordId){
        Case originalCase = [SELECT Id, Subject, Subject_No_Loop_Protection__c, ParentId FROM Case WHERE Id = :recordId LIMIT 1];
        String subjectSearch = '%' + originalCase.Subject + '%';
        Map<String,Case[]> foundCases = new Map<String,Case[]>(); 
        List<Case> foundSimilarCases = 
            [SELECT Id, Subject, Subject_No_Loop_Protection__c, ParentId, Description, CaseNumber, Parent.CaseNumber FROM Case WHERE Subject_No_Loop_Protection__c LIKE :subjectSearch AND Id != :originalCase.Id];
        Set<Id> foundSimilarCasesIds = new Set<Id>();
        Set<Id> foundSimilarCasesParentIds = new Set<Id>();
        for (Case c : foundSimilarCases) {
            foundSimilarCasesIds.add(c.Id);
            foundSimilarCasesParentIds.add(c.Id);
        }
        foundCases.put('similarCases', foundSimilarCases);
        foundCases.put('parentSimilarCases', 
            [SELECT Id, Subject, Description, ParentId, CaseNumber, Parent.CaseNumber FROM Case WHERE Id NOT IN :foundSimilarCasesIds AND Id NOT IN :foundSimilarCasesParentIds AND Id != :originalCase.Id]);
        return foundCases;
    }
}