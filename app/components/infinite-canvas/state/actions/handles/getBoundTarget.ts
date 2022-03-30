import { Utils } from '@tldraw/core'
import Vec from '@tldraw/vec'
import { ArrowShape, getShapeUtils, Shape } from '~/components/infinite-canvas/shapes'
import type { DrawingAppData } from '../../constants'

export function getBoundTarget(
  data: DrawingAppData,
  shape: ArrowShape,
  handlePoint: number[],
  oppositeHandleId: keyof ArrowShape['handles']
) {
  let minDistance = Infinity
  let toShape: Shape | undefined

  const oppositeBindingTargetId = Object.values(data.page.bindings).find(
    (binding) => binding.fromId === shape.id && binding.handleId === oppositeHandleId
  )?.toId

  // Find colliding shape with center nearest to point
  Object.values(data.page.shapes)
    .filter(
      (shape) =>
        !data.pageState.selectedIds.includes(shape.id) && shape.id !== oppositeBindingTargetId
    )
    .forEach((potentialTarget) => {
      const utils = getShapeUtils(potentialTarget)

      if (!utils.canBind) return

      const bounds = utils.getBounds(potentialTarget)

      if (Utils.pointInBounds(handlePoint, bounds)) {
        const dist = Vec.dist(handlePoint, utils.getCenter(potentialTarget))
        if (dist < minDistance) {
          minDistance = dist
          toShape = potentialTarget
        }
      }
    })

  return toShape
}