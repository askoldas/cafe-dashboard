import styles from './ListItem.module.scss'

const ListItem = ({ name, secondary }) => {
  return (
    <div className={styles.item}>
      <span className={styles.name}>{name}</span>
      {secondary && <span className={styles.secondary}>{secondary}</span>}
    </div>
  )
}

export default ListItem
