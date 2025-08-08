'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { WrenchIcon, CameraIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function Home() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const onSubmit = async(data) => {
        setIsSubmitting(true)

        try {
            const formData = new FormData()
            Object.keys(data).forEach(key => {
                formData.append(key, data[key])
            })
            if (selectedFile) {
                formData.append('image', selectedFile)
            }

            const response = await fetch('/api/reports', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                const result = await response.json()
                toast.success(`Maintenance request submitted successfully! Ticket: ${result.ticketNumber}`)
                reset()
                setSelectedFile(null)
                setPreviewUrl('')
            } else {
                const error = await response.json()
                throw new Error(error.error || 'Failed to submit request')
            }
        } catch (error) {
            toast.error(error.message || 'Failed to submit maintenance request. Please try again.')
            console.error('Error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return ( <
            div className = "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" >
            <
            div className = "container mx-auto px-4 py-8" > { /* Header */ } <
            div className = "text-center mb-8" >
            <
            div className = "flex justify-center mb-4" >
            <
            div className = "bg-primary-600 p-3 rounded-full" >
            <
            WrenchIcon className = "h-8 w-8 text-white" / >
            <
            /div> < /
            div > <
            h1 className = "text-4xl font-bold text-gray-900 mb-2" >
            KMU Hostel Maintenance <
            /h1> <
            p className = "text-lg text-gray-600" >
            Report maintenance issues in your hostel room <
            /p> < /
            div >

            { /* Main Form */ } <
            div className = "max-w-2xl mx-auto" >
            <
            div className = "card" >
            <
            form onSubmit = { handleSubmit(onSubmit) }
            className = "space-y-6" > { /* Hostel Selection */ } <
            div >
            <
            label className = "block text-sm font-medium text-gray-700 mb-2" >
            Hostel *
            <
            /label> <
            select {...register('hostel', { required: 'Hostel is required' }) }
            className = "input-field" >
            <
            option value = "" > Select Hostel < /option> <
            option value = "Hostel A" > Hostel A < /option> <
            option value = "Hostel B" > Hostel B < /option> <
            option value = "Hostel C" > Hostel C < /option> <
            option value = "Hostel D" > Hostel D < /option> <
            option value = "Hostel E" > Hostel E < /option> < /
            select > {
                errors.hostel && ( <
                    p className = "text-red-500 text-sm mt-1" > { errors.hostel.message } < /p>
                )
            } <
            /div>

            { /* Room Number */ } <
            div >
            <
            label className = "block text-sm font-medium text-gray-700 mb-2" >
            Room Number *
            <
            /label> <
            input type = "text" {...register('room', { required: 'Room number is required' }) }
            placeholder = "e.g., A101, B205"
            className = "input-field" /
            >
            {
                errors.room && ( <
                    p className = "text-red-500 text-sm mt-1" > { errors.room.message } < /p>
                )
            } <
            /div>

            { /* Issue Type */ } <
            div >
            <
            label className = "block text-sm font-medium text-gray-700 mb-2" >
            Issue Type *
            <
            /label> <
            select {...register('issueType', { required: 'Issue type is required' }) }
            className = "input-field" >
            <
            option value = "" > Select Issue Type < /option> <
            option value = "Electrical" > Electrical < /option> <
            option value = "Plumbing" > Plumbing < /option> <
            option value = "HVAC" > HVAC(Heating / Cooling) < /option> <
            option value = "Structural" > Structural < /option> <
            option value = "Furniture" > Furniture < /option> <
            option value = "Internet" > Internet / WiFi < /option> <
            option value = "Other" > Other < /option> < /
            select > {
                errors.issueType && ( <
                    p className = "text-red-500 text-sm mt-1" > { errors.issueType.message } < /p>
                )
            } <
            /div>

            { /* Description */ } <
            div >
            <
            label className = "block text-sm font-medium text-gray-700 mb-2" >
            Description *
            <
            /label> <
            textarea {...register('description', {
                    required: 'Description is required',
                    minLength: { value: 10, message: 'Description must be at least 10 characters' }
                })
            }
            rows = { 4 }
            placeholder = "Please describe the issue in detail..."
            className = "input-field" /
            >
            {
                errors.description && ( <
                    p className = "text-red-500 text-sm mt-1" > { errors.description.message } < /p>
                )
            } <
            /div>

            { /* Contact Information */ } <
            div >
            <
            label className = "block text-sm font-medium text-gray-700 mb-2" >
            Contact Information *
            <
            /label> <
            input type = "text" {...register('contact', { required: 'Contact information is required' }) }
            placeholder = "Phone number or email"
            className = "input-field" /
            >
            {
                errors.contact && ( <
                    p className = "text-red-500 text-sm mt-1" > { errors.contact.message } < /p>
                )
            } <
            /div>

            { /* Image Upload */ } <
            div >
            <
            label className = "block text-sm font-medium text-gray-700 mb-2" >
            Upload Image(Optional) <
            /label> <
            div className = "flex items-center space-x-4" >
            <
            label className = "cursor-pointer" >
            <
            div className = "flex items-center space-x-2 btn-secondary" >
            <
            CameraIcon className = "h-5 w-5" / >
            <
            span > Choose File < /span> < /
            div > <
            input type = "file"
            accept = "image/*"
            onChange = { handleFileChange }
            className = "hidden" /
            >
            <
            /label> {
            selectedFile && ( <
                span className = "text-sm text-gray-600" > { selectedFile.name } <
                /span>
            )
        } <
        /div> {
    previewUrl && ( <
        div className = "mt-4" >
        <
        img src = { previewUrl }
        alt = "Preview"
        className = "w-32 h-32 object-cover rounded-lg border" /
        >
        <
        /div>
    )
} <
/div>

{ /* Submit Button */ } <
button type = "submit"
disabled = { isSubmitting }
className = "w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2" > {
        isSubmitting ? ( <
            >
            <
            div className = "animate-spin rounded-full h-5 w-5 border-b-2 border-white" > < /div> <
            span > Submitting... < /span> < /
            >
        ) : ( <
            >
            <
            CheckCircleIcon className = "h-5 w-5" / >
            <
            span > Submit Maintenance Request < /span> < /
            >
        )
    } <
    /button> < /
    form > <
    /div>

{ /* Admin Link */ } <
div className = "text-center mt-6" >
    <
    a href = "/admin/login"
className = "text-primary-600 hover:text-primary-700 text-sm font-medium" >
    Admin Login→ <
    /a> < /
    div > <
    /div> < /
    div > <
    /div>
)
}