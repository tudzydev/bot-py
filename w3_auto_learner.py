#!/usr/bin/env python3
import time
import sys
import os
from playwright.sync_api import sync_playwright

def safe_goto(page, url, retries=3, delay=5):
    for attempt in range(1, retries + 1):
        try:
            # W3Schools loads a lot of slow external ads and tracker elements.
            # We wait for 'domcontentloaded' instead of default 'load' to speed up
            # the page changes and avoid ERR_TIMED_OUT from slow tracker domains.
            page.goto(url, timeout=20000, wait_until="domcontentloaded")
            return True
        except Exception as e:
            print(f"    [!] Warning: Navigation failed on attempt {attempt}/{retries}: {e}")
            if attempt < retries:
                print(f"    Waiting {delay} seconds before retrying...")
                time.sleep(delay)
            else:
                print("    [!] All navigation retry attempts failed.")
                raise e

def run_bot():
    print("==========================================================")
    print("         W3SCHOOLS PYTHON AUTO-LEARNER BOT                ")
    print("==========================================================")
    
    with sync_playwright() as p:
        # Launch Brave Browser on macOS, fallback to standard Chromium
        brave_path = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
        if os.path.exists(brave_path):
            print("[*] Launching Brave Browser...")
            browser = p.chromium.launch(headless=False, executable_path=brave_path)
        else:
            print("[!] Brave Browser not found at '/Applications/Brave Browser.app'.")
            print("[*] Launching standard Chromium browser...")
            browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        
        # Navigate to W3Schools login page
        print("[*] Navigating to W3Schools Login page...")
        safe_goto(page, "https://profile.w3schools.com/log-in")
        
        print("\n[IMPORTANT] ACTION REQUIRED:")
        print("1. Log in to your W3Schools account in the opened browser window.")
        print("2. Navigate to your dashboard or make sure you are fully logged in.")
        print("3. Once logged in, return here and press [ENTER] to start the automation.")
        
        input("\nPress [ENTER] here once you are logged in...")
        
        # Start at the current user lesson position (Python MySQL Drop Table)
        start_url = "https://www.w3schools.com/python/python_mysql_drop_table.asp"
        print(f"\n[*] Starting Python tutorial track at: {start_url}")
        safe_goto(page, start_url)
        time.sleep(3)
        
        # Parse left sidebar to find all Python tutorial links to determine course length
        print("[*] Extracting syllabus list from sidebar...")
        try:
            raw_links = page.evaluate("""
                () => {
                    const links = Array.from(document.querySelectorAll('#leftmenuinnerinner a'))
                        .map(a => a.href)
                        .filter(href => href.includes('/python/') && !href.includes('exercise') && !href.includes('quiz') && !href.includes('compiler') && !href.includes('trypython'));
                    return [...new Set(links)];
                }
            """)
            tutorial_links = [l for l in raw_links if l]
            total_pages = len(tutorial_links)
            print(f"[+] Found {total_pages} total tutorial pages in the Python course.")
        except Exception as e:
            print(f"[!] Could not parse sidebar: {e}. Defaulting to estimate of 55 pages.")
            tutorial_links = []
            total_pages = 55
            
        # Define progress configuration
        initial_progress = 60.0  # Your current W3Schools progress percentage
        target_progress = 100.0  # The target progress percentage to stop at
        
        # Find remaining links from the start URL to the end of the course
        remaining_links = []
        start_found = False
        clean_start_url = start_url.split('?')[0].split('#')[0]
        for link in tutorial_links:
            clean_link = link.split('?')[0].split('#')[0]
            if clean_link == clean_start_url:
                start_found = True
            if start_found:
                remaining_links.append(clean_link)
                
        total_remaining = len(remaining_links)
        print(f"[+] Found {total_remaining} remaining pages from current progress point to the end of course.")
        
        visited_pages = set()
        progress_pct = initial_progress
        
        while True:
            current_url = page.url
            
            # Stop if we leave the python tutorial directory
            if "/python/" not in current_url:
                print(f"\n[+] Navigation moved outside the Python directory: {current_url}")
                print("[+] Python course completion bot task finished!")
                break
                
            # Clean up URL parameters/hashes to count unique pages
            base_url = current_url.split('?')[0].split('#')[0]
            visited_pages.add(base_url)
            
            # Calculate current completion percentage relative to the remaining progress gap
            newly_visited = len(visited_pages)
            if total_remaining > 0:
                progress_pct = initial_progress + (newly_visited / total_remaining) * (100.0 - initial_progress)
            else:
                progress_pct = target_progress
                
            page_title = page.title()
            print(f"\n[+] Learning Page #{newly_visited}: {page_title}")
            print(f"    URL: {current_url}")
            print(f"    Progress: {progress_pct:.1f}% / {target_progress}%")
            

            
            # Scroll down slowly to simulate reading and trigger W3Schools' scroll progress triggers
            print("    Scrolling down to mark page as read...")
            for i in range(1, 6):
                scroll_height = i * 20
                page.evaluate(f"window.scrollTo(0, document.body.scrollHeight * {scroll_height} / 100)")
                time.sleep(0.5)
                
            time.sleep(1.5)  # Extra wait to ensure progress is tracked
            
            # Locate "Next" navigation button URL to bypass popup overlaps
            next_url = None
            try:
                next_url = page.evaluate("""
                    () => {
                        const anchors = Array.from(document.querySelectorAll('a.w3-right'));
                        const nextBtn = anchors.find(a => a.textContent.includes('Next'));
                        return nextBtn ? nextBtn.href : null;
                    }
                """)
            except Exception as e:
                print(f"    [!] Error finding Next link URL: {e}")

            if next_url:
                print(f"    Navigating directly to next page: {next_url}")
                safe_goto(page, next_url)
                time.sleep(2.5) # Wait for page to load
            else:
                print("[!] No 'Next' button URL found. We may have reached the end of the track.")
                break
        
        print("\n==========================================================")
        print(f"Success! Visited and completed {len(visited_pages)} Python tutorial pages ({progress_pct:.1f}% of course).")
        print("Your W3Schools account progress should now reflect the target completion.")
        print("==========================================================")
        
        print("[*] Keeping the browser open for 10 seconds to sync progress...")
        time.sleep(10)
        browser.close()

if __name__ == "__main__":
    try:
        run_bot()
    except KeyboardInterrupt:
        print("\n[-] Bot stopped by user.")
        sys.exit(0)
    except Exception as e:
        print(f"\n[!] Error occurred: {e}")
        sys.exit(1)
