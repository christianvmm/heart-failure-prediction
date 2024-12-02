import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Heart } from '@/features/heart-failure-prediction/components/heart'
import HeartFailurePredictionForm from '@/features/heart-failure-prediction/components/prediction-form'
import { HeartPulseIcon } from 'lucide-react'
import { useState } from 'react'

function App() {
   const [prediction, setPrediction] = useState<number | null>(null)
   const percentage = (prediction ?? 0) * 100

   return (
      <div className='grid grid-cols-1  md:grid-cols-2 gap-20 w-full min-h-screen max-w-screen-xl mx-auto items-start'>
         <div className='col-span-1  w-full py-10'>
            <HeartFailurePredictionForm setPrediction={setPrediction} />
         </div>

         <div className='col-span-1 w-full h-screen sticky top-0'>
            <div className='w-full h-full flex flex-col-reverse md:flex-col justify-end items-center py-10 px-8'>
               <Heart
                  key={percentage}
                  className='w-96 flex-1 '
                  fillPercentage={percentage}
               />

               {prediction !== null ? (
                  <Alert>
                     <HeartPulseIcon className='h-4 w-4' />
                     <AlertTitle>Resultado de la Predicción</AlertTitle>
                     <AlertDescription>
                        El riesgo estimado de padecer insuficiencia cardíaca es:{' '}
                        <strong>
                           {percentage.toFixed(2)}
                           {'%'}
                        </strong>
                     </AlertDescription>
                  </Alert>
               ) : (
                  <div className='h-[74px] w-full' />
               )}
            </div>
         </div>
      </div>
   )
}

export default App
