#!/usr/bin/env python3
"""
Test script to verify Notion API connection for both read and write operations.
Tests all 4 databases: Personas, Quotes, Issues, and Competitors.
"""

import asyncio
import sys
from datetime import datetime

from services.notion_reader import (
    get_all_personas,
    get_all_quotes,
    get_all_issues,
    get_all_competitors,
)
from services.notion_writer import (
    create_persona,
    create_quote,
    create_issue,
    create_competitor,
)
from models.persona import PersonaCreate
from models.quote import QuoteCreate
from models.issue import IssueCreate
from models.competitor import CompetitorCreate


def print_section(title: str):
    """Print a formatted section header."""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)


def print_success(message: str):
    """Print a success message."""
    print(f"✅ {message}")


def print_error(message: str):
    """Print an error message."""
    print(f"❌ {message}")


def print_info(message: str):
    """Print an info message."""
    print(f"ℹ️  {message}")


async def test_read_operations():
    """Test reading from all Notion databases."""
    print_section("TESTING READ OPERATIONS")

    try:
        print_info("Reading Personas...")
        personas = await get_all_personas()
        print_success(f"Successfully read {len(personas)} persona(s)")
        if personas:
            print(f"   Example: {personas[0].persona_type}")

        print_info("Reading Quotes...")
        quotes = await get_all_quotes()
        print_success(f"Successfully read {len(quotes)} quote(s)")
        if quotes:
            print(f"   Example: {quotes[0].quote_text[:50]}...")

        print_info("Reading Issues...")
        issues = await get_all_issues()
        print_success(f"Successfully read {len(issues)} issue(s)")
        if issues:
            print(f"   Example: {issues[0].issue_title}")

        print_info("Reading Competitors...")
        competitors = await get_all_competitors()
        print_success(f"Successfully read {len(competitors)} competitor(s)")
        if competitors:
            print(f"   Example: {competitors[0].competitor_name}")

        return True

    except Exception as e:
        print_error(f"Read operation failed: {str(e)}")
        import traceback

        traceback.print_exc()
        return False


async def test_write_operations():
    """Test writing to all Notion databases."""
    print_section("TESTING WRITE OPERATIONS")

    created_ids = {
        "persona": None,
        "quote": None,
        "issue": None,
        "competitor": None,
    }

    try:
        # Test 1: Create a Persona
        print_info("Creating a test Persona...")
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        test_persona = PersonaCreate(
            persona_type=f"Test Persona - {timestamp}",
            primary_use_case="Testing Notion API connection",
            communication_style="Analytical",
            goals="Verify write operations work correctly",
            constraints="Temporary test data",
        )
        persona_id = await create_persona(test_persona)
        created_ids["persona"] = persona_id
        print_success(f"Persona created with ID: {persona_id}")

        # Test 2: Create a Quote (linked to the persona)
        print_info("Creating a test Quote...")
        test_quote = QuoteCreate(
            quote_text=(
                "This is a test quote to verify the Notion API " "write connection."
            ),
            speaker="Test User",
            sentiment="Positive",
            quote_type="Insight",
            related_persona_id=persona_id,
        )
        quote_id = await create_quote(test_quote)
        created_ids["quote"] = quote_id
        print_success(f"Quote created with ID: {quote_id}")

        # Test 3: Create an Issue (linked to persona and quote)
        print_info("Creating a test Issue...")
        test_issue = IssueCreate(
            issue_title="Test Issue - API Connection Verification",
            issue_type="Pain Point",
            issue_details=(
                "This is a test issue created to verify that the Notion API "
                "write operations are working correctly."
            ),
            severity="Medium",
            related_persona_id=persona_id,
            related_quote_ids=[quote_id],
        )
        issue_id = await create_issue(test_issue)
        created_ids["issue"] = issue_id
        print_success(f"Issue created with ID: {issue_id}")

        # Test 4: Create a Competitor
        print_info("Creating a test Competitor...")
        test_competitor = CompetitorCreate(
            competitor_name=(
                f"Test Competitor - {datetime.now().strftime('%H:%M:%S')}"
            ),
            website="https://example.com",
            key_features="Test feature 1, Test feature 2",
            pricing="Free tier available",
            user_sentiment="Mixed",
        )
        competitor_id = await create_competitor(test_competitor)
        created_ids["competitor"] = competitor_id
        print_success(f"Competitor created with ID: {competitor_id}")

        print_section("WRITE OPERATIONS SUMMARY")
        print_success("All write operations completed successfully!")
        print("\nCreated test entries:")
        print(f"  - Persona ID: {created_ids['persona']}")
        print(f"  - Quote ID: {created_ids['quote']}")
        print(f"  - Issue ID: {created_ids['issue']}")
        print(f"  - Competitor ID: {created_ids['competitor']}")
        print(
            "\n⚠️  Note: These are test entries. "
            "You may want to delete them from Notion."
        )

        return True, created_ids

    except Exception as e:
        print_error(f"Write operation failed: {str(e)}")
        import traceback

        traceback.print_exc()
        return False, created_ids


async def test_read_after_write(created_ids: dict):
    """Test reading back the data we just wrote."""
    print_section("VERIFYING WRITTEN DATA (Read After Write)")

    try:
        # Verify persona
        if created_ids["persona"]:
            print_info("Verifying created Persona...")
            personas = await get_all_personas()
            found = next(
                (p for p in personas if p.id == created_ids["persona"]),
                None,
            )
            if found:
                print_success(f"Found created persona: {found.persona_type}")
            else:
                print_error(
                    "Could not find created persona " "(may need a moment to sync)"
                )

        # Verify quote
        if created_ids["quote"]:
            print_info("Verifying created Quote...")
            quotes = await get_all_quotes()
            found = next(
                (q for q in quotes if q.id == created_ids["quote"]),
                None,
            )
            if found:
                quote_preview = found.quote_text[:50]
                print_success(f"Found created quote: {quote_preview}...")
                if found.related_persona_id == created_ids["persona"]:
                    print_success("Quote correctly linked to Persona")
            else:
                print_error(
                    "Could not find created quote " "(may need a moment to sync)"
                )

        # Verify issue
        if created_ids["issue"]:
            print_info("Verifying created Issue...")
            issues = await get_all_issues()
            found = next(
                (i for i in issues if i.id == created_ids["issue"]),
                None,
            )
            if found:
                print_success(f"Found created issue: {found.issue_title}")
                if created_ids["quote"] in found.related_quote_ids:
                    print_success("Issue correctly linked to Quote")
            else:
                print_error(
                    "Could not find created issue " "(may need a moment to sync)"
                )

        # Verify competitor
        if created_ids["competitor"]:
            print_info("Verifying created Competitor...")
            competitors = await get_all_competitors()
            found = next(
                (c for c in competitors if c.id == created_ids["competitor"]),
                None,
            )
            if found:
                comp_name = found.competitor_name
                print_success(f"Found created competitor: {comp_name}")
            else:
                print_error(
                    "Could not find created competitor " "(may need a moment to sync)"
                )

        return True

    except Exception as e:
        print_error(f"Verification failed: {str(e)}")
        import traceback

        traceback.print_exc()
        return False


async def main():
    """Run all tests."""
    print_section("NOTION API CONNECTION TEST")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Test 1: Read operations
    read_success = await test_read_operations()

    if not read_success:
        print_error(
            "\n❌ Read operations failed. "
            "Please check your NOTION_INTERNAL_INTEGRATION_SECRET "
            "(or NOTION_TOKEN) and database IDs."
        )
        sys.exit(1)

    # Test 2: Write operations
    write_success, created_ids = await test_write_operations()

    if not write_success:
        print_error(
            "\n❌ Write operations failed. "
            "Please check your NOTION_INTERNAL_INTEGRATION_SECRET "
            "(or NOTION_TOKEN) and database permissions."
        )
        sys.exit(1)

    # Test 3: Verify written data
    print_info("\nWaiting 2 seconds for Notion to sync...")
    await asyncio.sleep(2)
    verify_success = await test_read_after_write(created_ids)

    # Final summary
    print_section("TEST SUMMARY")
    if read_success and write_success:
        print_success("✅ All tests passed!")
        print("\nNotion API connection is working correctly for:")
        print("  ✅ Reading from all databases")
        print("  ✅ Writing to all databases")
        if verify_success:
            print("  ✅ Data integrity verified")
    else:
        print_error("❌ Some tests failed. Please review the errors above.")
        sys.exit(1)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
        sys.exit(0)
    except Exception as e:
        print_error(f"\n❌ Unexpected error: {str(e)}")
        import traceback

        traceback.print_exc()
        sys.exit(1)
