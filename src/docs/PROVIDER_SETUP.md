# React Context Providers & Hooks Setup Guide

## Overview
This document explains the correct setup, hierarchy, and usage of React Context Providers in this application. Misconfigurations in the provider tree commonly lead to "Rules of Hooks" violations, specifically the `null is not an object (evaluating 'dispatcher.useState')` error.

## The Problem
If you see the error:
`TypeError: null is not an object (evaluating 'dispatcher.useState')`
Or:
`Invalid hook call. Hooks can only be called inside of the body of a function component.`

This typically means:
1. A hook (`useToast`, `useAuth`, etc.) is being called **outside** of a functional React component.
2. A component calling a hook is rendered **outside** of its respective Context Provider.
3. You have multiple versions of React loaded (rare in Vite, but possible).

## The Correct Provider Hierarchy
All providers are centralized in `src/lib/providerConfig.jsx` using the `<RootProviders />` component.
The strict order is: