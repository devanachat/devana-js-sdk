type AbuseCategory =
    'SpamOrScam'
    | 'HarassmentOrBullying'
    | 'HateSpeechOrExtremism'
    | 'ThreatsOrViolence'
    | 'SelfHarmOrSuicide'
    | 'SexualContent'
    | 'SexualExploitationOfMinors'
    | 'ChildSafety'
    | 'NonConsensualIntimateContent'
    | 'PrivacyViolation'
    | 'Impersonation'
    | 'IllegalGoodsOrServices'
    | 'RegulatedGoodsOrServices'
    | 'AccountSecurity'
    | 'IntellectualProperty'
    | 'Misinformation';

type ReportTarget = 'Profile' | 'Message';

export interface ReportAbuse {
    category: AbuseCategory;
    target: ReportTarget;
    userId?: string;
    messageId?: string;
}