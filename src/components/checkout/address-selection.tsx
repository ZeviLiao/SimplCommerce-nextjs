"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getUserAddresses } from "@/actions/checkout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type AddressData = {
	shippingAddressId: string;
	billingAddressId: string;
};

type UserAddress = Awaited<ReturnType<typeof getUserAddresses>>[number];

interface AddressSelectionProps {
	data: AddressData;
	onUpdate: (data: Partial<AddressData>) => void;
	onNext: () => void;
}

export function AddressSelection({ data, onUpdate, onNext }: AddressSelectionProps) {
	const [addresses, setAddresses] = useState<UserAddress[]>([]);
	const [loading, setLoading] = useState(true);
	const [useSameAddress, setUseSameAddress] = useState(true);

	const loadAddresses = useCallback(async () => {
		const userAddrs = await getUserAddresses();
		setAddresses(userAddrs);
		setLoading(false);

		// Auto-select default address
		const defaultAddr = userAddrs.find((ua) => ua.isDefault);
		if (defaultAddr && !data.shippingAddressId) {
			onUpdate({
				shippingAddressId: defaultAddr.addressId,
				billingAddressId: defaultAddr.addressId,
			});
		}
	}, [data.shippingAddressId, onUpdate]);

	useEffect(() => {
		loadAddresses();
	}, [loadAddresses]);

	const handleShippingAddressChange = (addressId: string) => {
		onUpdate({
			shippingAddressId: addressId,
			billingAddressId: useSameAddress ? addressId : data.billingAddressId,
		});
	};

	const handleBillingAddressChange = (addressId: string) => {
		onUpdate({ billingAddressId: addressId });
	};

	const handleUseSameAddressChange = (checked: boolean) => {
		setUseSameAddress(checked);
		if (checked) {
			onUpdate({ billingAddressId: data.shippingAddressId });
		}
	};

	const handleNext = () => {
		if (!data.shippingAddressId || !data.billingAddressId) {
			alert("Please select shipping and billing addresses");
			return;
		}
		onNext();
	};

	if (loading) {
		return <div>Loading addresses...</div>;
	}

	if (addresses.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-600 mb-4">You don't have any saved addresses.</p>
				<Link href="/account/addresses">
					<Button>Add Address</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
				<RadioGroup value={data.shippingAddressId} onValueChange={handleShippingAddressChange}>
					{addresses.map((userAddr) => (
						<div
							key={userAddr.addressId}
							className="flex items-start space-x-3 p-4 border rounded-lg"
						>
							<RadioGroupItem value={userAddr.addressId} id={`ship-${userAddr.addressId}`} />
							<Label htmlFor={`ship-${userAddr.addressId}`} className="flex-1 cursor-pointer">
								<div className="font-medium">{userAddr.address.contactName}</div>
								<div className="text-sm text-gray-600">
									{userAddr.address.addressLine1}
									{userAddr.address.addressLine2 && `, ${userAddr.address.addressLine2}`}
								</div>
								<div className="text-sm text-gray-600">
									{userAddr.address.city}, {userAddr.address.stateOrProvince?.name}{" "}
									{userAddr.address.zipCode}
								</div>
								<div className="text-sm text-gray-600">{userAddr.address.country?.name}</div>
								<div className="text-sm text-gray-600">Phone: {userAddr.address.phone}</div>
							</Label>
						</div>
					))}
				</RadioGroup>
			</div>

			<div className="flex items-center space-x-2">
				<Checkbox
					id="useSameAddress"
					checked={useSameAddress}
					onCheckedChange={handleUseSameAddressChange}
				/>
				<Label htmlFor="useSameAddress" className="cursor-pointer">
					Use shipping address as billing address
				</Label>
			</div>

			{!useSameAddress && (
				<div>
					<h2 className="text-xl font-semibold mb-4">Billing Address</h2>
					<RadioGroup value={data.billingAddressId} onValueChange={handleBillingAddressChange}>
						{addresses.map((userAddr) => (
							<div
								key={userAddr.addressId}
								className="flex items-start space-x-3 p-4 border rounded-lg"
							>
								<RadioGroupItem value={userAddr.addressId} id={`bill-${userAddr.addressId}`} />
								<Label htmlFor={`bill-${userAddr.addressId}`} className="flex-1 cursor-pointer">
									<div className="font-medium">{userAddr.address.contactName}</div>
									<div className="text-sm text-gray-600">
										{userAddr.address.addressLine1}
										{userAddr.address.addressLine2 && `, ${userAddr.address.addressLine2}`}
									</div>
									<div className="text-sm text-gray-600">
										{userAddr.address.city}, {userAddr.address.stateOrProvince?.name}{" "}
										{userAddr.address.zipCode}
									</div>
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>
			)}

			<div className="flex justify-end">
				<Button onClick={handleNext}>Continue to Shipping Method</Button>
			</div>
		</div>
	);
}
