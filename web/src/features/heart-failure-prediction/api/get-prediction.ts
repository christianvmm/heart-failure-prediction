import { z } from 'zod'

type PatientData = {
   sex: number
   chestPainType: number
   restingECG: number
   exerciseAngina: number
   stSlope: number
   fastingBS: number
   age: number
   restingBP: number
   cholesterol: number
   maxHR: number
   oldPeak: number
}

export async function getPrediction(body: PatientData) {
   const data = await fetch('http://localhost:3001/predict', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
   }).then((res) => res.json())

   const { predictions } = z
      .object({
         predictions: z.array(z.array(z.number())),
      })
      .parse(data)

   const prediction = predictions.at(0)?.at(0)

   if (!prediction) {
      throw new Error()
   }

   return prediction
}
