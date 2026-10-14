-- ============================================================================
-- IT Knowledge Hub — seed 20 troubleshooting articles
-- ============================================================================
-- Target table : public.articles
-- Columns used : title, category, description, "time", level, steps, published
--                (id and created_at use their existing defaults)
--
-- HOW TO RUN (review first, then run yourself):
--   1. Open your Supabase project > SQL Editor.
--   2. Paste the contents of this file and press Run.
--
-- SAFETY:
--   - Inserts ONLY; no UPDATE, DELETE, DROP, ALTER, or CREATE statements.
--   - Your 2 existing articles ("Outlook Will Not Open",
--     "Printer Is Not Printing") are not touched.
--   - Safe to run multiple times: every INSERT has a
--     WHERE NOT EXISTS check on title, so re-running inserts 0 rows.
--   - No database constraints were added or changed. (An ON CONFLICT
--     approach was deliberately avoided because no unique constraint on
--     title could be verified, and adding one would change the schema.)
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- OUTLOOK & EMAIL (4)
-- ----------------------------------------------------------------------------

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Outlook Emails Not Sending or Receiving', 'OUTLOOK & EMAIL', 'Check your connection, Outbox, and mailbox space when messages stop sending or arriving.', '5 min read', 'Beginner',
'[{"title": "Check your internet connection", "description": "Make sure your computer is connected to the office network, Wi-Fi, or VPN. Try opening an intranet page. If nothing loads, fix the connection first, then test Outlook again."}, {"title": "Look for stuck messages in the Outbox", "description": "In Outlook, open the Outbox folder. If a message is stuck there, open it, check the address, and press Send again. Very large attachments can block sending, so try removing them and resending."}, {"title": "Check your mailbox space", "description": "A nearly full mailbox can stop sending and receiving. Delete old or unneeded emails, empty the Deleted Items folder, and archive older mail according to your company retention policy."}, {"title": "Restart Outlook and contact IT if needed", "description": "Close Outlook completely, wait a few seconds, and reopen it. If mail still does not flow after these steps, contact IT support with the exact error message and when the problem started."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Outlook Emails Not Sending or Receiving');

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Outlook Password or Sign-In Problems', 'OUTLOOK & EMAIL', 'Regain access safely when Outlook rejects your password or keeps showing a sign-in screen.', '4 min read', 'Beginner',
'[{"title": "Check for typing mistakes", "description": "Make sure Caps Lock is off and you are typing your current work password carefully. Passwords are case sensitive, so retype slowly before trying anything else."}, {"title": "Reset your password the official way", "description": "Use only your company password reset portal or helpdesk process to reset a forgotten password. Never share your password with anyone, and never enter it on an unfamiliar website."}, {"title": "Remove old saved credentials", "description": "An outdated saved password can block sign-in. Open Windows Credential Manager, remove old Outlook or Office entries, restart Outlook, and sign in with your current password. Ask IT for help if you are unsure which entry to remove."}, {"title": "Contact IT if you are locked out", "description": "If your account is locked or sign-in still fails after a reset, contact IT support. Do not keep guessing passwords, as repeated failures can extend the lockout."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Outlook Password or Sign-In Problems');

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Outlook Mailbox Is Full', 'OUTLOOK & EMAIL', 'Free up space by cleaning up, archiving, and emptying folders when Outlook warns your mailbox is full.', '4 min read', 'Beginner',
'[{"title": "See what is using the space", "description": "In Outlook, go to File, then Tools, then Mailbox Cleanup to view your mailbox size. Sort large folders by size to find where the space is going."}, {"title": "Delete and empty unneeded mail", "description": "Delete old, duplicate, or unneeded emails, especially ones with large attachments. Then empty the Deleted Items folder, because items there still count against your quota."}, {"title": "Archive older mail", "description": "Move older messages you must keep into your archive or online archive, following your company retention policy. Do not store work mail in personal folders or on removable drives."}, {"title": "Ask IT about your quota", "description": "If the mailbox fills up again quickly during normal work, contact IT support. They can review your usage and advise whether a quota change or further cleanup is appropriate."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Outlook Mailbox Is Full');

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Outlook Keeps Asking for a Password', 'OUTLOOK & EMAIL', 'Stop repeated password prompts by checking credentials, connection, and sign-in settings.', '5 min read', 'Beginner',
'[{"title": "Enter your current password once, carefully", "description": "Type your current work password and tick the Remember my credentials box if your company allows it. Repeated guessing with an old password only causes more prompts."}, {"title": "Clear outdated saved credentials", "description": "Old saved credentials are a common cause. Open Windows Credential Manager, remove outdated Outlook or Office entries, restart Outlook, and sign in fresh. Ask IT for guidance if you are unsure."}, {"title": "Check your network connection", "description": "Password prompts can appear when Outlook cannot reach the mail server. Confirm you are connected to the office network, Wi-Fi, or VPN, then restart Outlook and try again."}, {"title": "Contact IT if prompts continue", "description": "If the sign-in box keeps returning, contact IT support. Repairing the Outlook profile or reauthenticating the account can require administrator help, so do not attempt profile surgery yourself."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Outlook Keeps Asking for a Password');

-- ----------------------------------------------------------------------------
-- PRINTERS (4)
-- ----------------------------------------------------------------------------

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Printer Shows Offline', 'PRINTERS', 'Bring an offline printer back online by checking power, connections, and printer settings.', '4 min read', 'Beginner',
'[{"title": "Check power and connections", "description": "Make sure the printer is switched on with no error lights, and that its USB cable or network cable is firmly connected. For wireless printers, confirm it is joined to the correct office Wi-Fi."}, {"title": "Restart the printer", "description": "Turn the printer off, wait about 30 seconds, and turn it back on. Wait until it finishes warming up before printing again."}, {"title": "Check the printer status in Windows", "description": "Open Settings, then Bluetooth and devices, then Printers and scanners. Select your printer and make sure Use Printer Offline is not enabled, and set your usual printer as the default."}, {"title": "Contact IT if it stays offline", "description": "If the printer still shows offline, note the printer name, location, and any error on its display, then contact IT support. Do not change network settings on shared printers yourself."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Printer Shows Offline');

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Print Jobs Stuck in the Queue', 'PRINTERS', 'Clear a stuck print queue safely and get your documents printing again.', '4 min read', 'Beginner',
'[{"title": "Open the print queue", "description": "Open Settings, then Bluetooth and devices, then Printers and scanners. Select your printer and click Open print queue to see the waiting documents."}, {"title": "Check for paused or error jobs", "description": "Look for jobs marked Paused or Error. If the printer itself is paused, resume it from the Printer menu in the queue window."}, {"title": "Cancel only your own stuck job", "description": "Right-click your own stuck document and cancel it, then try printing again. Never cancel other people''s print jobs; follow company procedures for shared printers."}, {"title": "Restart the printer and contact IT", "description": "Turn the printer off and on again and resend your document. If jobs keep getting stuck, contact IT support, since restarting the print service requires administrator rights."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Print Jobs Stuck in the Queue');

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Printer Paper Jam', 'PRINTERS', 'Remove jammed paper safely and prevent the next jam.', '3 min read', 'Beginner',
'[{"title": "Turn the printer off and let it cool", "description": "Switch the printer off and wait a few minutes before opening any covers. Warm internal parts can cause burns, so never reach inside a printer that has just been printing heavily."}, {"title": "Remove the jammed paper gently", "description": "Open the covers shown in the printer diagram and pull the jammed sheet slowly in the direction of the paper path. Never use sharp objects, knives, or tools inside the printer."}, {"title": "Check the paper tray", "description": "Remove wrinkled or torn sheets, fan the stack, and reload it neatly without overfilling the tray. Make sure the paper guides fit the paper size."}, {"title": "Ask for help if the jam persists", "description": "If paper keeps jamming, if pieces tore off inside, or if anything looks damaged, stop and contact IT support or facilities. Forcing parts can break the printer."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Printer Paper Jam');

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Find a Network Printer''s IP Address', 'PRINTERS', 'Locate a network printer IP address from its display or a printed network report.', '3 min read', 'Beginner',
'[{"title": "Check the printer display", "description": "On the printer screen, open the Setup or Network menu and look for Wired or Wireless Network Settings. The IP address is usually shown there, looking like four numbers separated by dots."}, {"title": "Print a network report", "description": "Many printers can print a Network Configuration or Wireless Test Report from the Reports menu. The report lists the printer IP address and connection status."}, {"title": "Ask IT before changing anything", "description": "Write down the address exactly as shown. Do not change the printer network settings yourself, as that can disconnect the printer for the whole office."}, {"title": "Share the details with IT", "description": "Give IT support the printer name, location, and IP address when reporting a problem or requesting setup. They will handle adding the printer to your computer."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Find a Network Printer''s IP Address');

-- ----------------------------------------------------------------------------
-- WINDOWS (4)
-- ----------------------------------------------------------------------------

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Computer Running Slowly', 'WINDOWS', 'Speed up a slow Windows PC with safe first steps before calling IT.', '5 min read', 'Beginner',
'[{"title": "Restart your computer", "description": "Save your work and restart the PC. A restart clears temporary slowdowns and finishes pending updates that can drag performance down."}, {"title": "Close what you are not using", "description": "Close programs, browser tabs, and large files you do not need right now. Each open item uses memory, and too many at once slows everything down."}, {"title": "Free up disk space safely", "description": "Check storage in Settings, then System, then Storage. Remove your own unneeded downloads and empty the Recycle Bin. Do not uninstall company software or delete files you do not recognise."}, {"title": "Contact IT if it stays slow", "description": "If slowness continues after a restart, contact IT support with details of when it is slow and which programs are affected. Startup changes, updates, and hardware checks should be left to IT."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Computer Running Slowly');

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Check IP Address Using CMD', 'WINDOWS', 'Find your computer IP address quickly with the ipconfig command.', '3 min read', 'Beginner',
'[{"title": "Open Command Prompt", "description": "Press the Windows key plus R, type cmd, and press Enter. A black Command Prompt window will open."}, {"title": "Run the ipconfig command", "description": "Type ipconfig and press Enter. This command only displays information and changes nothing on your computer."}, {"title": "Find your IPv4 address", "description": "Look for the IPv4 Address line under your active connection, such as Wi-Fi or Ethernet. It looks like four numbers separated by dots."}, {"title": "Share it with IT when asked", "description": "Copy the address exactly when IT support requests it for troubleshooting. Do not change any network settings yourself."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Check IP Address Using CMD');

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Wi-Fi Connected but No Internet', 'WINDOWS', 'Work through connection checks when Wi-Fi shows connected but pages will not load.', '4 min read', 'Beginner',
'[{"title": "Check whether it is just you", "description": "Ask a colleague or check another device. If nobody has internet, it may be an office-wide issue, so report it to IT instead of changing your own settings."}, {"title": "Reconnect to Wi-Fi", "description": "Disconnect from the Wi-Fi network, wait a few seconds, and reconnect, making sure you joined the correct office network. Do not reset or unplug shared office network equipment."}, {"title": "Run the Windows troubleshooter", "description": "Open Settings, then System, then Troubleshoot, then Other troubleshooters, and run Network and Internet. Apply only the standard suggested fixes."}, {"title": "Contact IT with details", "description": "If there is still no internet, contact IT support and mention whether others are affected, which network you joined, and any error message shown."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Wi-Fi Connected but No Internet');

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Windows Update Troubleshooting', 'WINDOWS', 'Fix stuck or failing Windows updates without breaking company update policies.', '5 min read', 'Beginner',
'[{"title": "Check the update status", "description": "Open Settings, then Windows Update, and read the current status and any error code shown. Write the code down for IT if you need help later."}, {"title": "Restart and try again", "description": "Save your work, restart the computer, and check for updates again. Many update problems clear after a proper restart."}, {"title": "Free up disk space", "description": "Updates need free space to install. Remove your own unneeded downloads and empty the Recycle Bin, then retry the update."}, {"title": "Contact IT instead of forcing it", "description": "Never disable updates, use unofficial fix tools, or install updates from random websites. Company updates are managed by policy, so contact IT support if updates keep failing."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Windows Update Troubleshooting');

-- ----------------------------------------------------------------------------
-- SOFTWARE (4)
-- ----------------------------------------------------------------------------

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Application Won''t Open', 'SOFTWARE', 'Get an application launching again with safe checks before reinstalling anything.', '4 min read', 'Beginner',
'[{"title": "Restart the app and the computer", "description": "Close the application fully, then reopen it. If it still will not open, save your work elsewhere and restart the computer before trying once more."}, {"title": "Check for approved updates", "description": "Open the Company Portal or Software Center if your company provides one, and install any offered update for the app. Otherwise ask IT whether an update is available."}, {"title": "Check whether the app is approved", "description": "Confirm the application is company-approved and was installed by IT. Unapproved or personally downloaded copies can fail or pose a security risk."}, {"title": "Contact IT with the error details", "description": "Never download installers or fixes from the internet. Contact IT support with the app name, version if shown, and the exact error message. Reinstallation should be done by IT."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Application Won''t Open');

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Install Approved Software', 'SOFTWARE', 'Request and install company software the right way, without risky downloads.', '4 min read', 'Beginner',
'[{"title": "Check the approved software list", "description": "Open the Company Portal or Software Center on your computer and search for the software you need. Install only what is offered there."}, {"title": "Request approval if it is missing", "description": "If the software is not listed, submit a request through your normal IT approval process with a business reason. Do not install it from the internet while waiting."}, {"title": "Never install unapproved downloads", "description": "Avoid free downloads, cracks, browser extensions, and personal installers. Unapproved software can carry malware and violate company policy."}, {"title": "Ask IT for installation help", "description": "If installation fails or asks for administrator rights, stop and contact IT support. Installing software with elevated rights must be handled by IT."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Install Approved Software');

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Application Freezes or Stops Responding', 'SOFTWARE', 'Recover from a frozen application and protect your unsaved work.', '4 min read', 'Beginner',
'[{"title": "Give it a moment", "description": "Wait one or two minutes first, since large files can make an app pause temporarily. Avoid clicking repeatedly, which can make the freeze worse."}, {"title": "Save work in your other apps", "description": "If other programs still respond, save your work in them before doing anything about the frozen one, so a restart does not cost you more data."}, {"title": "Close the frozen app safely", "description": "Press Ctrl plus Shift plus Esc to open Task Manager, select the frozen application, and end its task. Note that unsaved work in that app will be lost, and follow your company procedure before ending tasks."}, {"title": "Report repeated freezes to IT", "description": "If the same app keeps freezing, restart the computer and contact IT support with the app name, what you were doing, and how often it happens."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Application Freezes or Stops Responding');

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Microsoft Office Activation Problems', 'SOFTWARE', 'Fix Office sign-in and activation errors with your work account.', '4 min read', 'Beginner',
'[{"title": "Sign in with your work account", "description": "Open any Office app, check which account is shown, and sign in with your company work account if a personal account is displayed instead."}, {"title": "Check your connection", "description": "Activation needs to reach Microsoft servers. Confirm you are connected to the office network, Wi-Fi, or VPN, then restart the Office app and try again."}, {"title": "Install approved Office updates", "description": "In any Office app, open File, then Account, then Update Options, and install updates only through this official channel. Do not download Office copies or activators from the internet."}, {"title": "Contact IT about licensing", "description": "If Office still shows as unlicensed or keeps asking to activate, contact IT support. Licence assignment and activation resets require administrator help."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Microsoft Office Activation Problems');

-- ----------------------------------------------------------------------------
-- IT SECURITY (4)
-- ----------------------------------------------------------------------------

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Identify a Phishing Email', 'IT SECURITY', 'Spot the warning signs of phishing before you click, reply, or open attachments.', '5 min read', 'Beginner',
'[{"title": "Inspect the sender address", "description": "Look closely at the full sender address, not just the display name. Phishing mail often comes from misspelled domains or unexpected addresses pretending to be a known company or colleague."}, {"title": "Watch for pressure and generic greetings", "description": "Be suspicious of urgent threats, prize claims, or requests for passwords and payments, especially with vague greetings like Dear User instead of your name."}, {"title": "Check links and attachments without opening them", "description": "Hover over links to preview the real address, and treat unexpected attachments with suspicion. Do not click, download, or enable macros to investigate further."}, {"title": "Do not engage, report it instead", "description": "Do not reply, click, or forward the message to colleagues. Report it using your company phishing report button or process, then delete it from your inbox."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Identify a Phishing Email');

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Create a Strong Password', 'IT SECURITY', 'Build strong, unique passwords and store them safely.', '4 min read', 'Beginner',
'[{"title": "Make it long and unique", "description": "Use a long passphrase of several random words that you use nowhere else. Never reuse your work password on personal sites, and never use one password for everything."}, {"title": "Use the company password manager", "description": "If your company provides a password manager, store passwords there instead of in notes, spreadsheets, or browsers. Ask IT how to get access if you do not have it yet."}, {"title": "Never share your password", "description": "No colleague, manager, or IT staff member will ever need your password. Anyone asking for it by email, call, or message should be treated as suspicious and reported."}, {"title": "Turn on multi-factor authentication", "description": "Enable MFA wherever your company offers it, so a stolen password alone is not enough to access your account. Contact IT if you need help setting it up."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Create a Strong Password');

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Report a Suspicious Email', 'IT SECURITY', 'Report phishing and suspicious messages the right way to protect everyone.', '3 min read', 'Beginner',
'[{"title": "Do not interact with the message", "description": "Do not click links, open attachments, reply, or call phone numbers in a suspicious email. Interacting confirms your address and can trigger malware."}, {"title": "Report it through official channels", "description": "Use the Report Phishing button in Outlook if available, or forward the message as an attachment to your IT security address according to company process."}, {"title": "Delete it after reporting", "description": "Once reported, delete the message from your inbox and Deleted Items so nobody opens it by accident later."}, {"title": "Speak up if you already clicked", "description": "If you clicked a link or entered credentials before realising, tell IT security straight away. Fast reporting limits the damage, and you will not get in trouble for reporting quickly."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Report a Suspicious Email');

INSERT INTO public.articles (title, category, description, "time", level, steps, published)
SELECT 'Safely Handle Unexpected USB Devices', 'IT SECURITY', 'Do the safe thing when you find an unknown USB drive at work.', '3 min read', 'Beginner',
'[{"title": "Do not plug it in", "description": "Never connect an unknown, found, or gifted USB drive to any work computer. Attackers deliberately leave infected drives where people will find them."}, {"title": "Hand it to IT security", "description": "Take the device to IT security or your helpdesk without plugging it in anywhere, and say where and when you found it."}, {"title": "If it is already plugged in, stop", "description": "If you or someone else already connected it, unplug it, do not open any files or run anything from it, and inform IT security immediately."}, {"title": "Use only company-issued drives", "description": "For transferring work files, use only company-issued encrypted drives and approved sharing methods. Ask IT which option fits your task."}]'::jsonb,
true
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE title = 'Safely Handle Unexpected USB Devices');

COMMIT;

-- End of seed. Expected result on a fresh run: 20 rows inserted, 0 errors.
-- Re-running inserts 0 rows (all titles already exist).
