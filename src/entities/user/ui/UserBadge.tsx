import styles from './UserBadge.module.scss'
import type { User } from '../model/types'

export interface UserBadgeProps {
  user: Pick<User, 'name' | 'email'>
}

export function UserBadge({ user }: UserBadgeProps) {
  const initial = user.name.trim().charAt(0).toUpperCase()

  return (
    <span className={styles.root} title={user.email}>
      <span className={styles.avatar} aria-hidden>
        {initial}
      </span>
      <span className={styles.name}>{user.name}</span>
    </span>
  )
}
