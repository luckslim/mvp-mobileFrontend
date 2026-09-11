export type EventFormDataInput = {
  name: string;
  description: string;
  suggestedVisitTime: string;
  location: string;
  responsibleParty: string;
  image: {
    uri: string;
    name: string;
    mimeType: string;
    file?: Blob;
  };
};

export function createEventFormData(place: EventFormDataInput, file: Blob) {
  const formData = new FormData();
  formData.append('title', place.name);
  formData.append('content', place.description);
  formData.append('time', place.suggestedVisitTime);
  formData.append('location', place.location);
  formData.append('colaborators', place.responsibleParty);
  formData.append('file', file);

  return formData;
}
