const DishesPage = () => {
  const dummyItems = Array.from({ length: 50 }, (_, i) => `Dish item ${i + 1}`)

  return (
    <div>
      <h2>Блюда</h2>
      <p>Список и настройка позиций меню</p>

      <ul>
        {dummyItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default DishesPage
