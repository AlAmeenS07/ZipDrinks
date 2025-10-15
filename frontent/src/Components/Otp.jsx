import React, { useEffect, useRef, useState } from 'react'
import { Loader } from 'react-feather';
import { useSelector } from 'react-redux';

const Otp = ({ verifyOtp , resendOtp}) => {

      const [otp, setOtp] = useState(['', '', '', '', '', '']);
      const [timer , setTimer] = useState(59)
      let point = useRef([])
      const loading = useSelector(state => state.user.loading)

      useEffect(()=>{
        if(timer<=0)return

        const time = setInterval(() => {
          if(timer <= 10){
            setTimer(t => `0${t-1}`)
          }else{
            setTimer(t => t-1)
          }
        }, 1000);

        return ()=>{
          clearInterval(time)
        }

      },[timer])
      

    function hanleInput(e, index) {
        if (e.target.value.length > 0 && index < point.current.length - 1) {
            point.current[index + 1].focus()
        }
    }

    function handleBack(e, index) {
        if (e.key === "Backspace" && e.target.value == "" && index > 0) {
            point.current[index - 1].focus()
        }
    }

  return (
    <div>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Verify OTP</h2>
          <p className="text-center text-sm text-neutral-600 mb-8">
            We have sent a verification code to your email{' '}
            <span className="text-neutral-900 font-medium">test@gmail.com</span>
          </p>

          <div className="space-y-6">

            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={e => point.current[index] = e}
                  onInput={(e) => hanleInput(e, index)}
                  onKeyDown={(e) => handleBack(e, index)}
                  onChange={(e) => {
                    let newOtp = [...otp];
                    newOtp[index] = e.target.value;
                    setOtp(newOtp)
                  }}
                  className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-semibold border-2 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              ))}
            </div>

            <div className="text-center text-sm text-neutral-600">
              Send code again?{' '}
              <span className="text-neutral-900 font-medium">00:{timer}</span>
            </div>

            <div className="text-center text-sm">
              <span className="text-neutral-600">I didn't receive a code! </span>
              <button
                type="button"
                onClick={()=>{
                  setTimer(59)
                  resendOtp()
                }}
                className="text-teal-600 hover:text-teal-700 font-medium cursor-pointer"
              >
                Resend
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              onClick={()=> verifyOtp(otp)}
              className={`relative w-full flex items-center justify-center gap-2 my-4 
                                                                    py-2.5 rounded-lg font-medium text-white transition-all duration-300
                                                                    ${loading
                  ? "bg-teal-600 cursor-not-allowed opacity-90"
                  : "bg-teal-700 hover:bg-teal-800 active:scale-95"
                }`}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin text-white" size={18} />
                  <span>Verifying...</span>
                </>
              ) : (
                "Verify Otp"
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Otp
