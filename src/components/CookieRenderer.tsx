import type { Cookie } from '../types'
import { TintedIcon } from './TintedIcon'

export function CookieRenderer({ cookie }: { cookie: Cookie }) {
  return (
    <div>
      <TintedIcon category="base" iconId={cookie.base.iconId} color={cookie.base.color} />
      {cookie.mixIns.map((mixIn, index) => (
        <TintedIcon
          key={index}
          category="mixIn"
          iconId={mixIn.iconId}
          color={mixIn.color}
          pattern={mixIn.pattern}
        />
      ))}
      <TintedIcon category="topping" iconId={cookie.topping.iconId} color={cookie.topping.color} />
    </div>
  )
}
