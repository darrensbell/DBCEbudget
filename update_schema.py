'''import requests

def update_schema():
    # Replace with your actual Supabase URL and API key
    supabase_url = "https://cimgeatqjoltbbeifnmi.supabase.co"
    api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpbWdlYXRxam9sdGJiZWlmbm1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE3NzQ3MCwiZXhwIjoyMDcwNzUzNDcwfQ.E5A3GySnzAXzIA5CUP29UzlKtSZiuCW7xOToKQqnPsQ"

    # Fetch the schema from Supabase
    response = requests.get(f"{supabase_url}/rest/v1/", headers={"apikey": api_key})
    schema = response.json()

    # Filter for tables starting with "dbce_"
    dbce_tables = {name: table for name, table in schema["definitions"].items() if name.startswith("dbce_")}

    # Generate the Markdown content
    markdown_content = "This document outlines the database schema for the application. All tables and columns are defined here, and this file serves as the single source of truth for the database structure.\n\n"
    for table_name, table_definition in dbce_tables.items():
        markdown_content += f"### `{table_name}`\n\n"
        markdown_content += "| Column | Type | Description |\n"
        markdown_content += "| --- | --- | --- |\n"
        for column_name, column_definition in table_definition["properties"].items():
            description = column_definition.get("description", "")
            markdown_content += f"| {column_name} | {column_definition.get('format', 'N/A')} | {description} |\n"
        markdown_content += "\n"

    # Write the content to the schema file
    with open("database_schema.md", "w") as f:
        f.write(markdown_content)

if __name__ == "__main__":
    update_schema()'''