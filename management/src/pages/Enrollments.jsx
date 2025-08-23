import enrollments from '../data/enrollments.json'
import React from 'react'

export const Enrollments = () => {
    const [allEnrollments, setAllEnrollments] = React.useState(localStorage.getItem('enrollments') ?
                                                    JSON.parse(localStorage.getItem('enrollments')) : enrollments)
    // متلا بعرض من الاخير للاول الانرولمنتس
}