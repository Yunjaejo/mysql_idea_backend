
create table user(
	userId int(11) not null auto_increment,
	email varchar(50) not null unique,
	password varchar(40) not null unique,
    nickName varchar(40) not null unique,
	primary key(userId),
	index(email)
);
create table post(
	postId int(11) not null auto_increment,
	title varchar(50) not null,
	spec varchar(50),
	descr varchar(50),
	image varchar(255),
	place int(11) not null,
	primary key(postId),
	index(title)
);
create table comment(
	commentId int(11) not null auto_increment,
	commentTime varchar(50) not null,
	nickname varchar(50) not null,
	comment varchar(50) not null,
	upperPost int(20) not null,
	primary key(commentId),
	foreign key(upperPost)REFERENCES post(postId) ON DELETE CASCADE ON UPDATE CASCADE,
    foreign key(nickname)REFERENCES user(nickname) ON DELETE CASCADE ON UPDATE CASCADE,
	index(nickname)
);
create table wish(
	Id int(11) not null auto_increment,
	userId int(20) not null,
	postId int(20) not null,
	primary key(Id),
	foreign key(postId)REFERENCES post(postId) ON DELETE CASCADE ON UPDATE CASCADE,
    foreign key(userId)REFERENCES user(userId) ON DELETE CASCADE ON UPDATE CASCADE,
	index(userId)
);