const DishesPage = () => {
  const dummyItems = Array.from({ length: 50 }, (_, i) => `Dish item ${i + 1}`)

  return (
    <div>
      <h2>Dishes</h2>
      <p>List and configure your menu items.</p>

      <ul>
        {dummyItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default DishesPage
