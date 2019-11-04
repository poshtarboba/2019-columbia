<?php
	error_reporting(0);
	$mail = 'your_mail@gmail.com';
	$subject='Заказ термобелья Columbia';
	$order = '';
	$callback = '';
	$echo_msg = 'Заказ передан оператору, ожидайте звонка';
	if ($_POST['callback-no']) {
		$callback = 'НЕ НУЖЕН, только SMS';
		$echo_msg = 'Заказ передан оператору, ожидайте SMS с номером заказа';
	}
	if (isset($_POST['female-s'])) $order = $order + ' жен-S,';
	if (isset($_POST['female-m'])) $order = $order + ' жен-M';
	if (isset($_POST['female-l'])) $order = $order + ' жен-L';
	if (isset($_POST['female-xl'])) $order = $order + ' жен-XL';
	if (isset($_POST['male-m'])) $order = $order + ' муж-M,';
	if (isset($_POST['male-l'])) $order = $order + ' муж-L,';
	if (isset($_POST['male-xl'])) $order = $order + ' муж-XL';
	if (isset($_POST['male-xxl'])) $order = $order + ' муж-XXL,';
	$message = "<h1>Заказ термобелья Columbia</h1>
	<table>
		<tr>
			<td>Перезвон:</td>
			<td><b> $callback </b></td>
		</tr>
		<tr>
			<td>Телефон:</td>
			<td><b> $_POST['phone'] </b></td>
		</tr>
		<tr>
			<td>Клиент:</td>
			<td><b> $_POST['name'] </b></td>
		</tr>
		<tr>
			<td>Заказ:</td>
			<td><b> $order </b></td>
		</tr>
		<tr>
			<td>Город:</td>
			<td><b> $_POST['place'] </b></td>
		</tr>
		<tr>
			<td>Новая Почта:</td>
			<td><b> $_POST['postoffice'] </b></td>
		</tr>
	</table>";
	mail($mail, $subject, $message, 'Content-type: text/html; charset=utf-8 \r\n');
	echo $echo_msg;
