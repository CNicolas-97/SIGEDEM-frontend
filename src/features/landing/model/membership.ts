// QUÉ ES: los pasos para asociarse.
// NIVEL: model — datos y tipos, sin JSX.

export type MembershipStep = {
  title: string;
  description: string;
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
      'Individual, familiar o familia numerosa: todos incluyen lo mismo. Si te corresponde descuento de jubilado, se aplica ahí mismo.',
  },
  {
    title: 'Llevate el carnet',
    description:
      'Te damos el QR impreso y en el celular. Para el natatorio sumás el apto médico, que se carga en la misma ventanilla.',
  },
];
