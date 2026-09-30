// QUÉ ES: datos del abono: los pasos para asociarse y el carnet de ejemplo.
// NIVEL: model — datos y tipos, sin JSX.

export type MembershipStep = {
  title: string;
  description: string;
};

// Datos que se imprimen en el carnet del hero (son de ejemplo).
export type MembershipCardData = {
  holderName: string;
  plan: string;
  expiresOn: string;
  year: number;
};

// El número de paso no se guarda: lo calcula el componente con el índice.
export const membershipSteps: MembershipStep[] = [
  {
    title: 'Traé el DNI',
    description:
      'De cada integrante del grupo familiar. Si hay menores, viene el adulto responsable con la libreta o la partida.',
  },
  {
    title: 'Elegí el plan',
    description:
      'Individual, familiar o por actividad. Si te corresponde descuento de jubilado o familia numerosa, se aplica ahí mismo.',
  },
  {
    title: 'Llevate el carnet',
    description:
      'Te damos el QR impreso y en el celular. Para el natatorio sumás el apto médico, que se carga en la misma ventanilla.',
  },
];

export const sampleCard: MembershipCardData = {
  holderName: 'Pérez, María',
  plan: 'Abono familiar',
  expiresOn: '31/03',
  year: 2027,
};
