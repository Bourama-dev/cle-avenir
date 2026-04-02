# Telegram Daily Digest Setup Guide

This guide explains how to set up a Telegram bot and configure the n8n workflow to receive daily summaries of your application's activity.

## Prerequisites
- A Telegram account
- Access to your n8n instance
- Supabase Project URL and Service Role Key

## Step 1: Create a Telegram Bot

1. Open Telegram and search for **@BotFather**.
2. Start a chat and send the command `/newbot`.
3. Follow the instructions:
   - **Name**: Choose a display name (e.g., "Cleo Analytics Bot").
   - **Username**: Choose a unique username ending in `bot` (e.g., `cleo_analytics_bot`).
4. **Important**: Copy the **HTTP API Token** provided by BotFather. You will need this for n8n.

## Step 2: Get Your Chat ID

1. Start a conversation with your new bot (click the link provided by BotFather and press **Start**).
2. Send a dummy message (e.g., "Hello").
3. Open your browser and visit:
   `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   *(Replace `<YOUR_BOT_TOKEN>` with the token from Step 1)*
4. Look for the `"result"` array in the JSON response. Find the `"chat"` object inside `"message"`.
5. Copy the `id` value (e.g., `123456789`). This is your **Chat ID**.

*Example JSON Response:*