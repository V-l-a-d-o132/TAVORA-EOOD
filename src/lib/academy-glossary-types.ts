export type GlossaryRow = readonly [
  term: string,
  aliases: readonly string[],
  plainBulgarian: string,
  familiarAssociation: string,
];

export interface GlossaryTerm {
  term: string;
  plainBulgarian: string;
  familiarAssociation: string;
}
