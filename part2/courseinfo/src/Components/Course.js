const Header = ({ name }) => {
  return <h2>{name}</h2>
}

const Part = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const Content = ({ course }) => {
  const courseParts = course.map((part) => (
    <Part key={part.id} name={part.name} exercises={part.exercises} />
  ))

  const sumExercises = course.reduce((sum, value) => sum + value.exercises, 0)

  return (
    <div>
      {courseParts}
      <p>
        <b>Total of {sumExercises} exercises</b>
      </p>
    </div>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content course={course.parts} />
    </div>
  )
}

export default Course
