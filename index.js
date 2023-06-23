function h(tag, props, children) {
	return {
		tag,
		props,
		children
	}
}

function createVNode(vnode) {
	const { tag, props, children } = vnode
	const el = document.createElement(tag)

	for (const [key, value] of Object.entries(props)) {
		el.setAttribute(key, value)
	}

	if (Array.isArray(children)) {
		children.forEach(child => {
			if (typeof child === 'string') {
				el.appendChild(document.createTextNode(child))
			} else {
				el.appendChild(createVNode(child))
			}
		})
	} else if (typeof children === 'string') {
		el.appendChild(document.createTextNode(children))
	}

	return el
}

function patch(parent, oldVNode, newVNode) {
	if (oldVNode.tag !== newVNode.tag) {
		parent.replaceChild(createVNode(newVNode), oldVNode.el)
	} else {
		newVNode.el = oldVNode.el

		for (const [key, value] of Object.entries(newVNode.props)) {
			if (value !== oldVNode.props[key]) {
				newVNode.el.setAttribute(key, value)
			}
		}

		const oldChildren = oldVNode.children
		const newChildren = newVNode.children

		if (typeof newChildren === 'string') {
			if (oldChildren !== newChildren) {
				newVNode.el.textContent = newChildren
			}
		} else {
			const commonLength = Math.min(oldChildren.length, newChildren.length)

			for (let i = 0; i < commonLength; i++) {
				patch(newVNode.el, oldChildren[i], newChildren[i])
			}

			if (oldChildren.length > newChildren.length) {
				for (let i = commonLength; i < oldChildren.length; i++) {
					newVNode.el.removeChild(oldChildren[i].el)
				}
			} else if (oldChildren.length < newChildren.length) {
				for (let i = commonLength; i < newChildren.length; i++) {
					newVNode.el.appendChild(createVNode(newChildren[i]))
				}
			}
		}
	}
}


