**Запрос для вставки данных минимум о двух книгах в коллекцию books**

await db.collection('books').insertMany([

  {
		_id: id, 
    title: 'TestBook_1',
    description: 'test description',
    authors: 'test authors'
  },
	
  {
		_id: id_2,
    title: 'TestBook_2',
    description: 'test description 2',
    authors: 'test authors 2'
  },
	
  {
		_id: id_3,
    title: 'TestBook_3',
    description: 'test description 3',
    authors: 'test authors 3'
  }
	
]);


**Запрос для поиска полей документов коллекции books по полю title**

await db.collection('books').find({


  'title': 'search example'

	
});


**Запрос для редактирования полей: description и authors коллекции books по _id записи.**

await db.collection('books').updateOne(
  { _id: id },
  {
    $set: { 'title': 'edited title', 'description': 'edited description' },
    $currentDate: { lastModified: true }
  }
);
