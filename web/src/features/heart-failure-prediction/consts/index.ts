export const NUMBERIC_EQUIVALENCES = {
   sex: { F: 0, M: 1 },
   chestPainType: { ASY: 0, ATA: 1, NAP: 2, TA: 3 },
   restingecg: { LVH: 0, Normal: 1, ST: 2 },
   excerciseAngina: { N: 0, Y: 1 },
   stSlope: { Down: 0, Flat: 1, Up: 2 },
}

export const chestPainTypes = [
   {
      value: '2',
      name: 'Dolor No Anginoso',
   },
   {
      value: '3',
      name: 'Angina Típica',
   },
   {
      value: '1',
      name: 'Angina Atípica',
   },
   {
      value: '0',
      name: 'Asintomático',
   },
]

export const restingECGOptions = [
   {
      value: '1',
      name: 'Normal',
   },
   {
      value: '2',
      name: 'ST',
      description:
         'Presentando anormalidades en la onda ST-T (inversiones de la onda T y/o elevación o depresión del segmento ST de > 0.05 mV)',
   },
   {
      value: '0',
      name: 'LVH',
      description: `Mostrando probable o definitiva hipertrofia ventricular izquierda según los criterios de Estes`,
   },
]

export const stSlopeOptions = [
   {
      value: '2',
      name: 'Ascendente',
   },
   {
      value: '1',
      name: 'Plano',
   },
   {
      value: '0',
      name: 'Descendente',
   },
]
