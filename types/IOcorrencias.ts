export interface IFormOccurrence {
    status: string;
    weight: string;
    userId: string;
    buildingId: string;
    materialId: string;
    occurrenceOriginId: string;
    detailedOccurrenceOriginId: string;
    finalDestinationOccurrenceId: string;
    fallCauseId: string;
    collectionTransportUsedId: string;
    approvalStatus: string;
    images: string[];
    audio: string;
    transcription: string;
    approvalDate: string;
    approvalUpdatedByUserId: string;
}
