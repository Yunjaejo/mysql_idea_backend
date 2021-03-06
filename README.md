# mysql_idea_backend
항해99 3기 4주차 미니프로젝트 6조 백엔드 (김도형, 조윤재, 탁정규) <br>
프로젝트 기간: 2021년 10월 11일 ~ 2021년 10월 16일

### IDEA
사용자끼리 인테리어 소품을 소개해주는 공간입니다.<br>
팀원들의 아이디어, 그리고 IKEA의 서비스에서 영감을 얻었기에 <br>
프로젝트 명을 IDEA라고 정했습니다.

<hr>

### 소개
* 프론트엔드(React)와 백엔드(Node.js)의 첫 협업 프로젝트<br>
* CRUD를 이용한 회원가입, 게시글과 댓글, 위시리스트 구현
* ORM을 없이 데이터베이스 사용

<hr>

###  링크
http://ideafrontbuild.s3-website.ap-northeast-2.amazonaws.com/


<a href="https://github.com/devLily/Hanghae6-IDEA_frontend/tree/master">프론트엔드 github</a>
(권영준, 배수인, 배재경)
<hr>

### 사용한 기술 스택
* express
* mongoDB -> mySQL
* JWT
* swagger


<hr>

### 해결해야 했던 문제들
* sequelize없이 데이터베이스 접근 및 사용법이 익숙하지 않았음.
* 클라이언트에서 body에 담긴 url값이 db에 들어갈 때 변형됨
* DB에서 Join 처리를 했지만 쿼리문으로 DB에 두번 접속을 하여 처리를 해야했음. 한번의 요청으로 해야함.
* noSQL에서 동기화처리를 깔끔하게 했지만 SQL로 migration 처리하던도중 비동기 방식으로 계속되는 현상


### 해결 시도
* mySQL 쿼리문을 공부하고 node.js와 mySQL을 연동하는 법을 찾아서 접목
* 쿼리문 escape처리를 통해 해결
* Join 쿼리문을 이용하여 아래와 같이 DB에서 조인을 한 키값과 비교하여 처리하였음.
```sql
SELECT post.*, wish.Id FROM post inner join wish On post.postId = wish.postId WHERE wish.userId = ?
```
* 쿼리문을 프로미스를 이용하여 처리하는 것을 발견 이후 동기처리를 위해 awite추가와 DB동기화 처리를했음.
   

