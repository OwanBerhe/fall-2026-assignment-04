import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Parents before children
  await db.schema
    .createTable('authors')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('bio', 'text')
    .execute();

  await db.schema
    .createTable('genres')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('description', 'text')
    .execute();

  await db.schema
    .createTable('books')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('isbn', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('publication_year', 'integer', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('borrowers')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.notNull().unique().references('users.id').onDelete('cascade')
    )
    .addColumn('phone', 'varchar(255)', (col) => col.notNull())
    .execute();

  // Junction tables and child tables
  await db.schema
    .createTable('book_authors')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('book_id', 'integer', (col) =>
      col.notNull().references('books.id').onDelete('cascade')
    )
    .addColumn('author_id', 'integer', (col) =>
      col.notNull().references('authors.id').onDelete('cascade')
    )
    .addUniqueConstraint('book_authors_book_id_author_id_unique', [
      'book_id',
      'author_id',
    ])
    .execute();

  await db.schema
    .createIndex('book_authors_book_id_idx')
    .on('book_authors')
    .column('book_id')
    .execute();

  await db.schema
    .createIndex('book_authors_author_id_idx')
    .on('book_authors')
    .column('author_id')
    .execute();

  await db.schema
    .createTable('book_genres')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('book_id', 'integer', (col) =>
      col.notNull().references('books.id').onDelete('cascade')
    )
    .addColumn('genre_id', 'integer', (col) =>
      col.notNull().references('genres.id').onDelete('cascade')
    )
    .addUniqueConstraint('book_genres_book_id_genre_id_unique', [
      'book_id',
      'genre_id',
    ])
    .execute();

  await db.schema
    .createIndex('book_genres_book_id_idx')
    .on('book_genres')
    .column('book_id')
    .execute();

  await db.schema
    .createIndex('book_genres_genre_id_idx')
    .on('book_genres')
    .column('genre_id')
    .execute();

  await db.schema
    .createTable('loans')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('borrower_id', 'integer', (col) =>
      col.notNull().references('borrowers.id').onDelete('cascade')
    )
    .addColumn('book_id', 'integer', (col) =>
      col.notNull().references('books.id').onDelete('cascade')
    )
    .addColumn('loan_date', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('due_date', 'timestamp', (col) => col.notNull())
    .addColumn('returned_at', 'timestamp')
    .execute();

  await db.schema
    .createIndex('loans_borrower_id_idx')
    .on('loans')
    .column('borrower_id')
    .execute();

  await db.schema
    .createIndex('loans_book_id_idx')
    .on('loans')
    .column('book_id')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // REVERSE dependency order: children before parents (never drops existing users)
  await db.schema.dropTable('loans').execute();
  await db.schema.dropTable('book_genres').execute();
  await db.schema.dropTable('book_authors').execute();
  await db.schema.dropTable('borrowers').execute();
  await db.schema.dropTable('books').execute();
  await db.schema.dropTable('genres').execute();
  await db.schema.dropTable('authors').execute();
}
