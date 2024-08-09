const AnonymityLevels = {
  HttpAnonymous: 1,
  HTTPHigh: 2,
  HTTPTransparent: 3,
};

const AnonymityLevelsText = {
  [AnonymityLevels.HttpAnonymous]: "Http (anonymous)",
  [AnonymityLevels.HTTPHigh]: "Http (High)",
  [AnonymityLevels.HTTPTransparent]: "Http (transparent)",
};

export { AnonymityLevels, AnonymityLevelsText };
