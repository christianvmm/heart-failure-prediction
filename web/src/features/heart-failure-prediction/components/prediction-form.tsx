'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from '@/components/ui/card'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
} from '@/components/ui/select'
import { SelectValue } from '@radix-ui/react-select'
import {
   chestPainTypes,
   restingECGOptions,
   stSlopeOptions,
} from '@/features/heart-failure-prediction/consts'
import { getPrediction } from '@/features/heart-failure-prediction/api/get-prediction'

const formSchema = z.object({
   sex: z.string(),
   age: z.number().min(18).max(120),
   chestPainType: z.string(),
   restingBP: z.number(),
   cholesterol: z.number().min(0, 'Min. 0'),
   fastingBS: z.string(),
   restingECG: z.string(),
   maxHR: z.number().min(60, 'Min. 60').max(202, 'Max. 202'),
   exerciseAngina: z.string(),
   oldPeak: z.number().min(0, 'Min. 0').max(3, 'Max. 3'),
   stSlope: z.string(),
})

export default function HeartFailurePredictionForm({
   setPrediction,
}: {
   setPrediction: (value: number) => void
}) {
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         sex: '1',
         age: 50,
         chestPainType: chestPainTypes.at(0)?.value,
         fastingBS: '1',
         cholesterol: 95,
         restingBP: 95,
         restingECG: restingECGOptions.at(0)?.value,
         maxHR: 100,
         exerciseAngina: '1',
         oldPeak: 0.6,
         stSlope: stSlopeOptions.at(0)?.value,
      },
   })

   async function onSubmit(values: z.infer<typeof formSchema>) {
      const body = {
         ...values,
         sex: Number(values.sex),
         chestPainType: Number(values.chestPainType),
         restingECG: Number(values.restingECG),
         exerciseAngina: Number(values.exerciseAngina),
         stSlope: Number(values.stSlope),
         fastingBS: Number(values.fastingBS),
      }

      try {
         const prediction = await getPrediction(body)
         setPrediction(prediction)
      } catch {
         console.log('cago')
      }
   }

   const restingECG = form.watch('restingECG')
   const restingECGDescription = restingECGOptions.find(
      (o) => o.value === restingECG
   )?.description

   return (
      <Card className='w-full border-none shadow-none bg-transparent'>
         <CardHeader>
            <CardTitle className='font-bold'>
               Predicción de Riesgo de Insuficiencia Cardíaca
            </CardTitle>
            <CardDescription>
               Ingresa los datos del paciente para estimar el riesgo de
               insuficiencia cardíaca.
            </CardDescription>
         </CardHeader>

         <CardContent className=' pb-0'>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  noValidate
                  className='flex flex-col w-full gap-4'
               >
                  <FormField
                     control={form.control}
                     name='sex'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Sexo</FormLabel>
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder='Selecciona el sexo del paciente' />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 <SelectItem value='1'>Hombre</SelectItem>
                                 <SelectItem value='0'>Mujer</SelectItem>
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='age'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Edad</FormLabel>
                           <FormControl>
                              <Input
                                 type='number'
                                 {...field}
                                 onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                 }
                              />
                           </FormControl>
                           <FormDescription>
                              Edad del paciente en años
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='chestPainType'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Tipo de Dolor en el Pecho</FormLabel>
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder='Tipo de Dolor en el Pecho' />
                                 </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                 {chestPainTypes.map((type) => {
                                    return (
                                       <SelectItem
                                          value={type.value}
                                          key={type.value}
                                       >
                                          {type.name}
                                       </SelectItem>
                                    )
                                 })}
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='restingBP'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>
                              Presión Arterial en Reposo (mm Hg)
                           </FormLabel>
                           <FormControl>
                              <Input
                                 type='number'
                                 {...field}
                                 onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                 }
                              />
                           </FormControl>
                           <FormDescription>
                              Presión arterial en reposo, medida en milímetros
                              de mercurio (mm Hg)
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='cholesterol'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Colesterol (mg/dL)</FormLabel>
                           <FormControl>
                              <Input
                                 type='number'
                                 {...field}
                                 onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                 }
                              />
                           </FormControl>
                           <FormDescription>
                              Colesterol sérico, medido en miligramos por
                              decilitro (mg/dL)
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name='fastingBS'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Azúcar en Sangre en Ayunas</FormLabel>
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder='Azúcar en Sangre en Ayunas' />
                                 </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                 <SelectItem value='1'>Alta</SelectItem>
                                 <SelectItem value='0'>Normal</SelectItem>
                              </SelectContent>
                           </Select>

                           <FormDescription>
                              {
                                 'Alta: si el azúcar en sangre en ayunas > 120 mg/dl, Normal: en caso contrario'
                              }
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='restingECG'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>
                              Resultados del Electrocardiograma en Reposo
                           </FormLabel>
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder='Resultados del Electrocardiograma en Reposo' />
                                 </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                 {restingECGOptions.map((option) => {
                                    return (
                                       <SelectItem
                                          key={option.value}
                                          value={option.value}
                                       >
                                          {option.name}
                                       </SelectItem>
                                    )
                                 })}
                              </SelectContent>
                           </Select>

                           <FormDescription>
                              {restingECGDescription}
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='maxHR'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>
                              Frecuencia Cardíaca Máxima Alcanzada (bpm)
                           </FormLabel>
                           <FormControl>
                              <Input
                                 type='number'
                                 {...field}
                                 onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                 }
                              />
                           </FormControl>

                           <FormDescription>
                              La Frecuencia Cardíaca Máxima Alcanzada se refiere
                              a la frecuencia cardíaca más alta alcanzada
                              durante una prueba de esfuerzo, típicamente
                              durante el ejercicio máximo.
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='exerciseAngina'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Angina Inducida por Ejercicio</FormLabel>
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder='Angina Inducida por Ejercicio' />
                                 </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                 <SelectItem value='1'>Sí</SelectItem>
                                 <SelectItem value='0'>No</SelectItem>
                              </SelectContent>
                           </Select>

                           <FormDescription>
                              La Angina Inducida por Ejercicio se refiere al
                              dolor o malestar en el pecho que ocurre durante o
                              después de un esfuerzo físico, típicamente como
                              resultado de un flujo sanguíneo inadecuado hacia
                              el músculo cardíaco (isquemia miocárdica).
                           </FormDescription>

                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='oldPeak'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Oldpeak (mm)</FormLabel>
                           <FormControl>
                              <Input
                                 type='number'
                                 {...field}
                                 onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                 }
                              />
                           </FormControl>
                           <FormDescription>
                              Grado de depresión del segmento ST observado en un
                              electrocardiograma (ECG) durante la prueba de
                              esfuerzo, comparado con la línea base (estado en
                              reposo).
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='stSlope'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Pendiente del Segmento ST</FormLabel>
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder='Pendiente del Segmento ST' />
                                 </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                 {stSlopeOptions.map((option) => {
                                    return (
                                       <SelectItem
                                          value={option.value}
                                          key={option.value}
                                       >
                                          {option.name}
                                       </SelectItem>
                                    )
                                 })}
                              </SelectContent>
                           </Select>

                           <FormDescription>
                              Se refiere a la pendiente del segmento ST durante
                              el ejercicio máximo en una prueba de esfuerzo. El
                              segmento ST representa el tiempo cuando el músculo
                              cardíaco está entre contracciones, y su pendiente
                              puede proporcionar información valiosa sobre la
                              respuesta del corazón al ejercicio.
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <Button type='submit' className='w-full'>
                     Predecir Riesgo
                  </Button>
               </form>
            </Form>
         </CardContent>
      </Card>
   )
}
