import React, { useState, useEffect } from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

let count = 0

function generateId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
}

let memoryState = { toasts: [] }

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      }
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return { ...state, toasts: [] }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    default:
      return state;
  }
}

const listeners = []

function dispatch(action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    try {
      listener(memoryState)
    } catch (e) {
      console.warn("Failed to notify toast listener:", e)
    }
  })
}

function addToRemoveQueue(toastId) {
  // Simplified for robustness
}

function toast(props) {
  if (!props) {
    console.warn("Toast called without props");
    return null;
  }
  
  try {
    const id = generateId()

    const update = (newProps) =>
      dispatch({
        type: actionTypes.UPDATE_TOAST,
        toast: { ...newProps, id },
      })
      
    const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

    dispatch({
      type: actionTypes.ADD_TOAST,
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) dismiss()
        },
      },
    })

    return { id, dismiss, update }
  } catch (error) {
    console.error("Toast system failed:", error)
    window.alert(props.title ? `${props.title}\n${props.description || ''}` : props.description || 'Notification');
    return {
      id: 'fallback',
      dismiss: () => {},
      update: () => {},
    }
  }
}

function useToast() {
  const [state, setState] = useState(memoryState)

  useEffect(() => {
    let isMounted = true;
    const listener = (newState) => {
      if (isMounted) setState(newState)
    };
    
    listeners.push(listener)
    return () => {
      isMounted = false;
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...state,
    toast: (props) => {
      try {
        return toast(props)
      } catch (err) {
        console.error("useToast call failed:", err);
        return { id: 'error', dismiss: () => {}, update: () => {} };
      }
    },
    dismiss: (toastId) => {
      try {
        dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
      } catch (err) {
        console.error("Dismiss failed:", err);
      }
    },
  }
}

export { useToast, toast }