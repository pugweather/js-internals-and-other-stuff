import styles from "./Form.module.css"
import { useState } from "react"
import { z } from "zod"

export default function Form() {

    const [step, setStep] = useState(1)
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirm_password: '',
        first_name: '',
        last_name: ''
    })

    return (
        <div className={styles.page}>
            <div className={styles.form}>
                {step === 0 && <Account formData={formData} onChange={setFormData} setStep={setStep} errors={errors} setErrors={setErrors} />}
                {step === 1 && <Profile formData={formData} onChange={setFormData} setStep={setStep} errors={errors} setErrors={setErrors} />}
                {step === 2 && <Complete setStep={setStep} />}
            </div>
        </div>
    )  
}

function Account({ formData, onChange, setStep, errors, setErrors }) {

    const accountSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
        confirm_password: z.string()
    }).refine(d => d.password === d.confirm_password, { message: "passwords do not match", path: ["confirm_password"]})
    
    function handleNext() {
        const result = accountSchema.safeParse(formData)
        if (result.success) {
            setStep(1)
            setErrors({})
        } else {
            const errs = {}
            result.error.issues.forEach(x => errs[x.path[0]] = x.message)
            setErrors(errs)
        }
    }

    const fields = [
        {
            field: "email",
            label: "email",
        },
         {
            field: "password",
            label: "password",
        },
         {
            field: "confirm_password",
            label: "confirm password",
        }
    ]

    return (
        <div>
            {
                fields.map(x => 
                    <Field 
                        key={x.field}
                        field={x.field} 
                        label={x.label} 
                        formData={formData} 
                        onChange={onChange} 
                        errors={errors}
                        setErrors={setErrors}
                    />
                )
            }
            <button onClick={handleNext} >next</button>
        </div>
    )
}

function Profile({ formData, onChange, setStep, errors, setErrors }) {

    const profileSchema = z.object({
        first_name: z.string().min(1),
        last_name: z.string().min(1),
    })
    
    function handleNext() {
        const result = profileSchema.safeParse(formData)
        if (result.success) {
            setStep(2)
            setErrors({})
        } else {
            const errs = {}
            result.error.issues.forEach(x => errs[x.path[0]] = x.message)
            setErrors(errs)
        }
    }

    const fields = [
        {
            field: "first_name",
            label: "first name",
        },
         {
            field: "last_name",
            label: "last name",
        },
    ]

    return (
        <div>
            {
                fields.map(x => 
                    <Field 
                        key={x.field}
                        field={x.field} 
                        label={x.label} 
                        formData={formData} 
                        onChange={onChange} 
                        errors={errors}
                        setErrors={setErrors}
                    />
                )
            }
            <button onClick={handleNext} >finish</button>
        </div>
    )
}

function Complete({ setStep }) {
    return (
        <div style={{margin: "auto"}}>Complete!</div>
    )
}

function Field({ field, label, formData, onChange, setErrors, errors}) {
    

    function handleChange(value) {
        onChange(prev => ({...prev, [field]: value}))
        setErrors(prev => {
            const newErrors = {...prev}
            delete newErrors[field]
            return newErrors
        })
    }

    return (
        <div>
            <label htmlFor={field}>{label}</label>
            <input id={field} type="text" value={formData[field]} onChange={(e) => handleChange(e.target.value)} />
            {errors?.[field] && <div className={styles.error}>{errors[field]}</div>}
        </div>
    )
}